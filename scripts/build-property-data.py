"""Compile bundled public parcel samples into replaceable illustrative insurer records.
Only parcel geometry, identifiers and site addresses are retained. No owner data.
"""
from pathlib import Path
import json, math, hashlib
ROOT=Path(__file__).resolve().parent.parent
REGIONS=['berkeley','millvalley','truckee','losangeles','napa','sandiego','ventura']
NOTES=[('srn1','berkeley',.20,.075),('srn2','berkeley',.18,.14),('srn3','millvalley',.22,0),('srn4','truckee',.19,0),('srn5','losangeles',.21,.65),('srn6','napa',.20,.30),('srn7','sandiego',.18,.90),('srn8','ventura',.20,0)]
BERKELEY=[[-122.2382,37.8528],[-122.2252,37.8562],[-122.2228,37.8642],[-122.2270,37.8722],[-122.2302,37.8802],[-122.2330,37.8880],[-122.2420,37.8942],[-122.2532,37.8898],[-122.2562,37.8818],[-122.2520,37.8742],[-122.2470,37.8682],[-122.2500,37.8620],[-122.2468,37.8570]]
LA=[[-118.525,34.066],[-118.500,34.083],[-118.478,34.105],[-118.452,34.132],[-118.438,34.162],[-118.462,34.184],[-118.500,34.174],[-118.526,34.151],[-118.542,34.122],[-118.548,34.092]]
NAPA=[[-122.348,38.352],[-122.332,38.352],[-122.331,38.362],[-122.339,38.366],[-122.349,38.362]]
SD=[[-117.137,32.895],[-117.125,32.894],[-117.118,32.904],[-117.125,32.913],[-117.139,32.907]]
def inside(p,ring):
 x,y=p;flag=False
 for a,b in zip(ring,ring[1:]+ring[:1]):
  if (a[1]>y)!=(b[1]>y) and x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]:flag=not flag
 return flag

def in_polygon(p,rings):return inside(p,rings[0]) and not any(inside(p,h) for h in rings[1:])
def point_area(rings):
 r=rings[0];origin=r[0];pts=[(x-origin[0],y-origin[1]) for x,y,*_ in r];a=cx=cy=0
 for (x,y),(xx,yy) in zip(pts,pts[1:]+pts[:1]):
  cross=x*yy-xx*y;a+=cross;cx+=(x+xx)*cross;cy+=(y+yy)*cross
 if not a:return None,0
 center=[origin[0]+cx/(3*a),origin[1]+cy/(3*a)]
 area=abs(a/2)*111320**2*math.cos(math.radians(center[1]))
 if not in_polygon(center,rings):
  # Interior scanline point for concave parcels and parcels with holes.
  miny=min(p[1] for p in r);maxy=max(p[1] for p in r)
  found=None
  for fraction in [.5,.25,.75,.125,.875]:
   y=miny+(maxy-miny)*fraction;xs=[]
   for ring in rings:
    for u,v in zip(ring,ring[1:]+ring[:1]):
     if (u[1]>y)!=(v[1]>y):xs.append(u[0]+(y-u[1])*(v[0]-u[0])/(v[1]-u[1]))
   xs.sort()
   spans=sorted(zip(xs[::2],xs[1::2]),key=lambda z:z[1]-z[0],reverse=True)
   for l,h in spans:
    if in_polygon([(l+h)/2,y],rings):found=[(l+h)/2,y];break
   if found:break
  if not found:return None,area
  center=found
 return [round(v,7) for v in center],area

def fraction(key):return int(hashlib.sha256(key.encode()).hexdigest()[:8],16)/0xffffffff

def field(props,*keys):return next((str(props[k]).strip() for k in keys if props.get(k) not in [None,'',0]),'')
regions={};manifest=[]
for region in REGIONS:
 files=[ROOT/'assets/parcels'/f'{region}.geojson',ROOT/'assets/parcels'/f'{region}-extra.geojson']
 seen=set();features=[];source=''
 for file in files:
  if not file.exists():continue
  data=json.loads(file.read_text());source=data['source']
  for f in data['features']:
   props=f['properties'];apn=field(props,'APN','apn','prop_id','ASMTWithDash','PARNO')
   if not apn or apn in seen or not f.get('geometry'):continue
   geom=f['geometry'];polys=geom['coordinates'] if geom['type']=='MultiPolygon' else [geom['coordinates']]
   candidates=[(poly,*point_area(poly)) for poly in polys]
   valid=[c for c in candidates if c[1] is not None]
   if not valid:continue
   poly,point,area=max(valid,key=lambda c:c[2])
   if not 120<=area<=20000:continue
   address=field(props,'SitusAddress','SitusFullAddress','ADDRESS','FullSitusAddress1','situsforma','situsfor_2')
   if not address and props.get('SITUS_ADDRESS'):
    address=' '.join(str(props.get(k,'')).strip() for k in ['SITUS_ADDRESS','SITUS_STREET','SITUS_SUFFIX']).strip()
   # Keep the largest contiguous piece for duplicate/stacked assessor records.
   seen.add(apn)
   geometry={'type':'Polygon','coordinates':[[[round(c[0],6),round(c[1],6)] for c in ring] for ring in poly]}
   features.append({'type':'Feature','geometry':geometry,'properties':{'parcelId':apn,'address':address,'point':point,'areaSqm':round(area)}})
 if not features:raise RuntimeError(f'No usable parcels: {region}')
 regions[region]={'type':'FeatureCollection','features':features,'source':source}
 manifest.append({'region':region,'source':source,'parcels':len(features)})
notes={}
for key,region,sample,severity in NOTES:
 features=regions[region]['features']
 if region=='berkeley':
  # Distinct illustrative carrier books: FAIR Plan concentrates on southern
  # hillside parcels; State Farm concentrates on northern/lower neighborhoods.
  # A shared assignment key prevents the same parcel appearing in both books.
  selected=[]
  for f in features:
   props=f['properties'];pid=props['parcelId'];x,y=props['point']
   north=y>=37.87;hillside=x>=-122.247
   fair_share=.25 if north else .72 if hillside else .45
   owner='srn1' if fraction('berkeley-carrier:'+pid)<fair_share else 'srn2'
   probability=(.9 if hillside and not north else .06 if north else .18) if key=='srn1' else (.55 if north else .6 if hillside else .10)
   if owner==key and fraction(key+':'+pid)<probability:selected.append(f)
 else:
  selected=[f for f in features if fraction(key+':'+f['properties']['parcelId'])<sample]
 if len(selected)<50:selected=sorted(features,key=lambda f:fraction(key+':'+f['properties']['parcelId']))[:min(50,len(features))]
 ring=BERKELEY if key in ['srn1','srn2'] else LA if key=='srn5' else NAPA if key=='srn6' else SD if key=='srn7' else None
 records=[]
 for f in selected:
  props=f['properties'];pid=props['parcelId'];burned=bool(ring and inside(props['point'],ring))
  value=round((650000+fraction('value:'+key+pid)*1750000)*(1.6 if key=='srn5' else 1)/1000)*1000
  damage=round(value*severity) if burned else 0
  records.append({'parcelId':pid,'insuredValue':value,'burnStatus':'Burned' if burned else 'Unburned','modeledDamage':damage})
 notes[key]={'region':region,'holdings':records,'severity':severity,'fire':{'type':'FeatureCollection','features':([] if not ring else [{'type':'Feature','properties':{'name':'Illustrative fire footprint'},'geometry':{'type':'Polygon','coordinates':[ring+[ring[0]]]}}])},'burnRule':'Parcel representative point inside the modeled fire footprint','summary':{'propertyCount':len(records),'insuredValue':sum(r['insuredValue'] for r in records),'burnedCount':sum(r['burnStatus']=='Burned' for r in records),'burnedInsuredValue':sum(r['insuredValue'] for r in records if r['burnStatus']=='Burned'),'modeledDamage':sum(r['modeledDamage'] for r in records)}}
 print(key,notes[key]['summary'])
out={'version':1,'regions':regions,'notes':notes}
(ROOT/'assets/property-data.js').write_text('// Public parcel geometry; illustrative insurer membership, values and fire status.\nconst EUCLID_PROPERTY_DATA = '+json.dumps(out,separators=(',',':'))+';\n')
(ROOT/'assets/parcels/sources.json').write_text(json.dumps(manifest,indent=2)+'\n')
