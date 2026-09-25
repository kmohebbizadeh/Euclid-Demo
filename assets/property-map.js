/* The insurer schedule and classification feed can replace these bundled records. */
let PROPERTY_LAYER, PROPERTY_FIRE_LAYER, SELECTED_PARCEL;
const propertyEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function propertyStyle(feature){
 const selected=feature.properties.parcelId===SELECTED_PARCEL,burned=feature.properties.burnStatus==='Burned';
 return {color:selected?'#142a43':burned?'#a33d2d':'#315f89',weight:selected?3:1.2,fillColor:burned?'#d8654d':'#6b96ba',fillOpacity:selected?.85:.65};
}
function renderPropertySummary(){
 const s=EUCLID_PROPERTY_DATA.notes[PORTFOLIO.key].summary;
 document.getElementById('property-summary').innerHTML=[['Portfolio properties',num(s.propertyCount)],['Total insured value',usdS(s.insuredValue)],['Burned properties',num(s.burnedCount)],['Burned insured value',usdS(s.burnedInsuredValue)]].map(([label,value])=>'<div><span class="lbl">'+label+'</span><strong>'+value+'</strong></div>').join('');
}
function selectProperty(feature,zoom){
 const p=feature.properties,n=EUCLID_PROPERTY_DATA.notes[PORTFOLIO.key],region=EUCLID_PROPERTY_DATA.regions[n.region];
 SELECTED_PARCEL=p.parcelId;PROPERTY_LAYER.setStyle(propertyStyle);
 const layer=PROPERTY_LAYER.getLayers().find(l=>l.feature.properties.parcelId===p.parcelId);layer.bringToFront();
 if(zoom)map.fitBounds(layer.getBounds(),{maxZoom:18,padding:[60,60]});
 document.getElementById('property-picker').value=p.parcelId;
 document.getElementById('insp-id').textContent='Parcel '+p.parcelId;
 const rows=[['Site address',p.address||'Address not supplied'],['Portfolio',PORTFOLIO.carrier+' · '+PORTFOLIO.note],['Insured value',new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(p.insuredValue)],['Modeled property damage',new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(p.modeledDamage)]];
 document.getElementById('insp-body').innerHTML='<span class="property-status '+(p.burnStatus==='Burned'?'burned':'')+'">'+p.burnStatus+'</span>'+rows.map(([k,v])=>'<div class="property-detail-row">'+k+'<b>'+propertyEscape(v)+'</b></div>').join('')+'<div class="property-source">Burn status: parcel representative point inside the modeled fire footprint. Damage uses '+(n.severity*100).toFixed(1)+'% severity on burned insured value.<br><br>Public parcel boundaries; illustrative portfolio membership, insured values and fire status. Geographic sample only.<br><a href="'+propertyEscape(region.source)+'" target="_blank" rel="noopener noreferrer">Parcel data source ↗</a></div>';
}
function initPropertyMap(){
 const note=EUCLID_PROPERTY_DATA.notes[PORTFOLIO.key],region=EUCLID_PROPERTY_DATA.regions[note.region];
 const holdings=new Map(note.holdings.map(p=>[p.parcelId,p]));
 const features=region.features.filter(f=>holdings.has(f.properties.parcelId)).map(f=>({...f,properties:{...f.properties,...holdings.get(f.properties.parcelId)}}));
 map=L.map('map',{maxZoom:20,scrollWheelZoom:false,preferCanvas:true});
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxNativeZoom:19,maxZoom:20,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
 map.createPane('fire');map.getPane('fire').style.zIndex=350;map.getPane('fire').style.pointerEvents='none';
 L.geoJSON(region,{interactive:false,style:{color:'#9ca7b1',weight:.6,fillOpacity:0}}).addTo(map);
 PROPERTY_FIRE_LAYER=L.geoJSON(note.fire,{pane:'fire',interactive:false,style:{color:'#d47743',weight:2,dashArray:'6 5',fillColor:'#e39b68',fillOpacity:.18}});
 PROPERTY_LAYER=L.geoJSON({type:'FeatureCollection',features},{style:propertyStyle,onEachFeature:(f,layer)=>{
  const p=f.properties;
  layer.bindTooltip(propertyEscape(p.address||'Parcel '+p.parcelId)+'<br><b>'+usdS(p.insuredValue)+'</b> insured · '+p.burnStatus,{sticky:true});
  layer.on('click',()=>selectProperty(f,false));
 }}).addTo(map);
 map.fitBounds(PROPERTY_LAYER.getBounds(),{padding:[25,25],maxZoom:15});
 L.control.scale({imperial:false}).addTo(map);
 document.getElementById('legend').innerHTML='<span><i style="background:#6b96ba"></i>Unburned</span><span><i style="background:#d8654d"></i>Burned</span><span><i style="background:#c5cbd0"></i>Other parcels</span>';
 const picker=document.getElementById('property-picker');
 picker.innerHTML='<option value="">Select a property…</option>'+features.map(f=>'<option value="'+propertyEscape(f.properties.parcelId)+'">'+propertyEscape(f.properties.address||f.properties.parcelId)+' · '+f.properties.burnStatus+'</option>').join('');
 picker.onchange=()=>{const f=features.find(f=>f.properties.parcelId===picker.value);if(f)selectProperty(f,true);};
 window.addEventListener('resize',()=>map.invalidateSize());
}
