const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('euclid-loss-determination.html','utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)[1].split('const T0 = performance.now();')[0];
const storage=new Map();
const sessionStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
const stub={getContext:()=>({}),textContent:'',innerHTML:'',style:{},addEventListener(){},querySelectorAll:()=>[]};
const context=vm.createContext({location:{hash:'#portfolio'},document:{getElementById:()=>stub,querySelectorAll:()=>[],querySelector:()=>stub},sessionStorage,console,Intl,Date,performance});
vm.runInContext(fs.readFileSync('assets/property-data.js','utf8'),context);
vm.runInContext(source,context);
vm.runInContext(fs.readFileSync('assets/portfolio-overview.js','utf8'),context);
const run=s=>vm.runInContext(s,context), near=(a,b)=>assert.ok(Math.abs(a-b)<.00001,`${a} != ${b}`);
for(const p of run('Object.values(PORTFOLIOS)')){
 near(run(`positionReturn(PORTFOLIOS.${p.key})`),3+6*p.currentEL/p.limit*100);
 const m=run(`termMetrics(PORTFOLIOS.${p.key})`);near(m.currentRunoff[0],m.totalRate);
 assert.ok(m.remainingRate<=m.totalRate);assert.equal(m.elapsedMonths+m.remainingMonths,m.totalMonths);
 assert.ok(run(`historyDates(PORTFOLIOS.${p.key}.start,PORTFOLIOS.${p.key}.quarterlyEL.length).every(d=>d<=AS_OF)`));
}
near(run('termMetrics(PORTFOLIOS.srn1).remainingMonths'),16);
for(const key of ['srp1','srp2']){
 const pool=run(`SRP_POOLS.${key}`), pm=run(`srpPoolMetrics(SRP_POOLS.${key})`),ts=run(`allSRPTranches().filter(t=>t.poolKey==='${key}')`);
 near(ts.reduce((sum,t)=>sum+t.currentBalance*t.currentELRate/100,0),pm.currentELValue);
 near(ts.reduce((sum,t)=>sum+t.currentBalance*t.expectedReturn/100,0),pool.grossIncome-pm.currentELValue);
 near(pool.lossScenarios.reduce((sum,s)=>sum+s.probability,0),1);
 near(pool.lossScenarios.reduce((sum,s)=>sum+s.probability*s.loss,0),pm.currentELValue);
 const equity=ts.find(t=>t.tranche==='Equity');
 near(equity.navPerUnit*equity.unitsOutstanding,pm.assetValue-ts.filter(t=>t.tranche!=='Equity').reduce((sum,t)=>sum+t.currentBalance,0));
 near(pm.assetValue,pm.collateralMV+pool.cash);
 for(const loss of [0,1e6,8e6,10e6,25e6,50e6]){
  const allocated=run(`allocateLoss(SRP_POOLS.${key},${loss})`);
  near(Object.values(allocated).reduce((s,x)=>s+x,0),loss);
 }
}
const before=run('({cash:demoCash,available:PORTFOLIOS.srn6.available})');
run("settleTrade(PORTFOLIOS.srn6,'Buy',500000,marketPricingTerms(PORTFOLIOS.srn6).ask)");
near(run('PORTFOLIOS.srn6.investment'),500000);near(run('demoCash'),before.cash-492750);
near(run('PORTFOLIOS.srn6.available'),before.available-500000);
assert.throws(()=>run("settleTrade(PORTFOLIOS.srn6,'Sell',1000000,98.25)"));
run("settleTrade(PORTFOLIOS.srn6,'Sell',500000,marketPricingTerms(PORTFOLIOS.srn6).bid)");
assert.equal(run('PORTFOLIOS.srn6.owned'),false);near(run('PORTFOLIOS.srn6.costBasis'),0);
near(run('PORTFOLIOS.srn6.available'),before.available);
assert.throws(()=>run("settleTrade(PORTFOLIOS.srn1,'Buy',255000,100.52)"));
assert.throws(()=>run("settleTrade(PORTFOLIOS.srn1,'Buy',NaN,100.52)"));
run("settleTrade(SRP_TRANCHES['srp1-equity'],'Buy',25000,SRP_TRANCHES['srp1-equity'].ask)");
near(run("capitalHeld(SRP_TRANCHES['srp1-equity'])"),250000);
near(run("positionCurrentValue(SRP_TRANCHES['srp1-equity'])"),25000*run("SRP_TRANCHES['srp1-equity'].price"));
run("SRP_TRANCHES['srp1-equity'].heldAmount=0;restoreSession()");
near(run("SRP_TRANCHES['srp1-equity'].heldAmount"),25000);
console.log('PASS: all 8 SRN benchmarks; all 6 tranche losses/returns; pool cash and equity NAV; stress conservation; dates; buy/sell balances, limits, cost basis, equity units and session restoration.');

for(const [key,note] of Object.entries(run('EUCLID_PROPERTY_DATA.notes'))){
 const region=run('EUCLID_PROPERTY_DATA.regions')[note.region];
 const parcels=new Map(region.features.map(f=>[f.properties.parcelId,f]));
 assert.equal(parcels.size,region.features.length);
 assert.equal(new Set(note.holdings.map(p=>p.parcelId)).size,note.holdings.length);
 let value=0,burned=0,burnValue=0,damage=0;
 for(const p of note.holdings){
  assert.ok(parcels.has(p.parcelId));assert.ok(p.insuredValue>0);assert.ok(p.modeledDamage<=p.insuredValue);
  value+=p.insuredValue;damage+=p.modeledDamage;
  if(p.burnStatus==='Burned'){burned++;burnValue+=p.insuredValue;near(p.modeledDamage,Math.round(p.insuredValue*note.severity));}
  else {assert.equal(p.burnStatus,'Unburned');assert.equal(p.modeledDamage,0);}
 }
 assert.equal(note.summary.propertyCount,note.holdings.length);near(note.summary.insuredValue,value);
 near(note.summary.burnedCount,burned);near(note.summary.burnedInsuredValue,burnValue);near(note.summary.modeledDamage,damage);
 near(run(`underlyingDamage(PORTFOLIOS.${key})`),damage);
 console.log(`PASS: ${key} parcel membership, values, burn status and shared event totals`);
}

function inRing(point,ring){let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
for(const note of Object.values(run('EUCLID_PROPERTY_DATA.notes'))){
 const parcels=new Map(run('EUCLID_PROPERTY_DATA.regions')[note.region].features.map(f=>[f.properties.parcelId,f]));
 for(const p of note.holdings){const f=parcels.get(p.parcelId),pt=f.properties.point;assert.ok(inRing(pt,f.geometry.coordinates[0]));const burned=note.fire.features.some(f=>inRing(pt,f.geometry.coordinates[0]));assert.equal(p.burnStatus==='Burned',burned);}
}
console.log('PASS: property representative points and independent fire classification');

const overview=run('portfolioOverviewMetrics(Object.values(PORTFOLIOS).concat(allSRPTranches()).filter(p=>p.owned))');
near(overview.total,overview.holdings+run('demoCash'));
near(Object.values(overview.allocation).reduce((s,v)=>s+v,0),overview.total);
for(const field of ['notes','regions','insurers'])near(Object.values(overview[field]).reduce((s,v)=>s+v,0),overview.invested);
near(run('portfolioProjectedIncome(portfolioOverviewMetrics(Object.values(PORTFOLIOS).concat(allSRPTranches()).filter(p=>p.owned)).positions,0)'),0);
assert.ok(run('portfolioProjectedIncome(Object.values(PORTFOLIOS).concat(allSRPTranches()).filter(p=>p.owned),12)')<=overview.income+.00001);
run("PORTFOLIO_FILTER={kind:'note',value:'srn1'}");assert.ok(run('matchesPortfolioFilter(PORTFOLIOS.srn1)'));assert.ok(!run('matchesPortfolioFilter(PORTFOLIOS.srn2)'));assert.ok(run("matchesPortfolioFilter(SRP_TRANCHES['srp1-senior'])"));
run("PORTFOLIO_FILTER={kind:'allocation',value:'Cash'}");assert.ok(!run('matchesPortfolioFilter(PORTFOLIOS.srn1)'));
run('PORTFOLIO_FILTER=null');
console.log('PASS: overview value and allocation conservation; look-through totals; projection limits; direct and pool filters');
const berkeley=run('EUCLID_PROPERTY_DATA.regions.berkeley.features'), bPoints=new Map(berkeley.map(f=>[f.properties.parcelId,f.properties.point]));
const fair=run('EUCLID_PROPERTY_DATA.notes.srn1.holdings'),state=run('EUCLID_PROPERTY_DATA.notes.srn2.holdings'),fairIds=new Set(fair.map(p=>p.parcelId));
assert.ok(state.every(p=>!fairIds.has(p.parcelId)));
const northShare=rows=>rows.filter(p=>bPoints.get(p.parcelId)[1]>=37.87).length/rows.length;
assert.ok(northShare(state)>northShare(fair)+.4);
console.log('PASS: distinct Berkeley carrier books and geographic concentrations');
