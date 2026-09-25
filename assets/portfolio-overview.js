let PORTFOLIO_FILTER=null;
function portfolioOverviewMetrics(positions){
 const m={positions,invested:0,holdings:0,loss:0,income:0,months:0,juniorEquity:0,allocation:{SRN:0,'SRP Senior':0,'SRP Junior':0,'SRP Equity':0,Cash:demoCash},notes:{},regions:{},insurers:{}};
 positions.forEach(p=>{
  const capital=capitalHeld(p);m.invested+=capital;m.holdings+=positionCurrentValue(p);m.loss+=capital*positionELRate(p)/100;m.income+=capital*positionReturn(p)/100;m.months+=capital*positionDates(p).remainingMonths;
  m.allocation[isSRP(p)?'SRP '+p.tranche:'SRN']+=positionCurrentValue(p);
  if(isSRP(p)&&p.tranche!=='Senior')m.juniorEquity+=capital;
  const weights=isSRP(p)?SRP_POOLS[p.poolKey].holdings:[{key:p.key,notional:1}],total=weights.reduce((s,h)=>s+h.notional,0);
  weights.forEach(h=>{m.notes[h.key]=(m.notes[h.key]||0)+capital*h.notional/total;});
 });
 Object.entries(m.notes).forEach(([key,value])=>{const p=PORTFOLIOS[key];m.regions[p.market]=(m.regions[p.market]||0)+value;m.insurers[p.carrier]=(m.insurers[p.carrier]||0)+value;});
 m.total=m.holdings+demoCash;m.months=m.invested?m.months/m.invested:0;return m;
}
function matchesPortfolioFilter(p){
 if(!PORTFOLIO_FILTER)return true;
 const {kind,value}=PORTFOLIO_FILTER;
 if(kind==='allocation')return value==='Cash'?false:(isSRP(p)?'SRP '+p.tranche:'SRN')===value;
 if(kind==='subordinate')return isSRP(p)&&p.tranche!=='Senior';
 const keys=isSRP(p)?SRP_POOLS[p.poolKey].holdings.map(h=>h.key):[p.key];
 return keys.some(k=>kind==='note'?k===value:kind==='region'?PORTFOLIOS[k].market===value:PORTFOLIOS[k].carrier===value);
}
function renderPortfolioOverview(positions){
 const m=portfolioOverviewMetrics(positions),esc=propertyEscape,pct=(v,total)=>total?100*v/total:0;
 const cards=[['Total portfolio value',usdS(m.total),usdS(m.holdings)+' holdings + '+usdS(demoCash)+' cash'],['Invested capital',usdS(m.invested),positions.length+' positions · original capital held'],['Available cash',usdS(demoCash),'Available for investment · no yield assumed'],['Expected annual net return',pct(m.income,m.invested).toFixed(2)+'%','Capital-weighted · after expected loss · fees excluded'],['Expected annual income',usdS(m.income),'Net economic return estimate · not a cash distribution'],['Annual expected loss',usdS(m.loss),pct(m.loss,m.invested).toFixed(2)+'% of invested capital']];
 document.getElementById('portfolio-summary').innerHTML='<table class="compact-summary"><caption>Portfolio overview</caption><tbody>'+[0,1,2].map(i=>'<tr>'+[cards[i],cards[i+3]].map(([label,value,note])=>'<th scope="row" title="'+esc(note)+'">'+label+'</th><td title="'+esc(note)+'">'+value+'</td>').join('')+'</tr>').join('')+'</tbody></table><div class="summary-basis">'+positions.length+' positions · '+usdS(m.holdings)+' holdings + '+usdS(demoCash)+' cash · Returns on invested capital, after expected loss, fees excluded</div>';

 const button=(kind,value,label,detail)=>'<button class="overview-filter" data-overview-kind="'+kind+'" data-overview-value="'+esc(value)+'" aria-pressed="'+!!(PORTFOLIO_FILTER?.kind===kind&&PORTFOLIO_FILTER.value===value)+'"><span>'+esc(label)+'</span><b>'+detail+'</b></button>';
 const chart=(values,kind,total,title,basis)=>{
  const entries=Object.entries(values).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  const colors=['#244c75','#5684ad','#8faec8','#c4d3df','#a89474','#718b83','#b5beb1'];let offset=0;
  const arcs=entries.map(([name,v],i)=>{const share=pct(v,total),arc='<circle cx="60" cy="60" r="44" fill="none" stroke="'+colors[i%colors.length]+'" stroke-width="17" pathLength="100" stroke-dasharray="'+share+' '+(100-share)+'" stroke-dashoffset="'+(-offset)+'" transform="rotate(-90 60 60)"><title>'+esc(name)+': '+share.toFixed(1)+'%</title></circle>';offset+=share;return arc;}).join('');
  return '<section class="overview-panel compact-chart"><h2>'+title+'</h2><p>'+basis+'</p><div class="donut-layout"><svg viewBox="0 0 120 120" role="img" aria-label="'+title+' distribution"><circle cx="60" cy="60" r="44" fill="none" stroke="#edf1f5" stroke-width="17"/>'+arcs+'<text x="60" y="59" text-anchor="middle" font-size="13" fill="#233a53">'+usdS(total)+'</text><text x="60" y="73" text-anchor="middle" font-size="7" fill="#657285">'+(kind==='allocation'?'TOTAL VALUE':'ALLOCATED CAPITAL')+'</text></svg><div class="donut-legend">'+entries.map(([name,v],i)=>'<div class="donut-row"><i style="background:'+colors[i%colors.length]+'"></i>'+button(kind,name,name,pct(v,total).toFixed(1)+'%')+'</div>').join('')+'</div></div></section>';
 };

 const largestNote=Object.entries(m.notes).sort((a,b)=>b[1]-a[1])[0],largestInsurer=Object.entries(m.insurers).sort((a,b)=>b[1]-a[1])[0];
 document.getElementById('portfolio-context').innerHTML=chart(m.allocation,'allocation',m.total,'Asset allocation','Market value · includes cash')+chart(m.regions,'region',m.invested,'Geographic exposure','Direct + pool look-through')+chart(m.insurers,'insurer',m.invested,'Insurer / portfolio mix','Direct + pool look-through')+'<div class="compact-risk">'+(largestNote?button('note',largestNote[0],'Largest SRN · '+PORTFOLIOS[largestNote[0]].note,pct(largestNote[1],m.invested).toFixed(1)+'%'):'')+button('subordinate','all','Junior + equity',pct(m.juniorEquity,m.invested).toFixed(1)+'%')+'<span>Weighted term <b>'+m.months.toFixed(1)+' mo</b></span></div><details class="compact-method"><summary>Projection and calculation details</summary><p>Geographic and insurer charts allocate invested capital by pool collateral weights. Tranche losses depend on the waterfall; these allocations are not insured values or maximum loss. Expected income is a net economic return estimate, not a cash distribution. Annual expected loss is '+pct(m.loss,m.invested).toFixed(2)+'% of invested capital.</p><div class="projection-head"><h2>Expected income projection</h2><label>Horizon <select id="projection-horizon"><option value="3">3 months</option><option value="6">6 months</option><option value="12" selected>12 months</option></select></label></div><div id="portfolio-projection-chart"></div><p>Current expected returns accrued evenly, capped at remaining term. Excludes fees, cash yield, price movements and reinvestment. Not realized performance or a payment schedule.</p></details>';
 document.getElementById('projection-horizon').onchange=e=>renderPortfolioProjection(positions,Number(e.target.value));
 renderPortfolioProjection(positions,12);
 document.getElementById('portfolio-filter-status').innerHTML=PORTFOLIO_FILTER?'<span>Showing '+esc(PORTFOLIO_FILTER.value==='all'?'junior and equity':PORTFOLIO_FILTER.value)+(PORTFOLIO_FILTER.kind==='allocation'?'':' · matching direct and pool positions')+'</span><button class="market-btn" id="clear-portfolio-filter">Clear filter</button>':'<span>'+positions.length+' positions · select a breakdown above to filter</span>';
 document.getElementById('clear-portfolio-filter')?.addEventListener('click',()=>{PORTFOLIO_FILTER=null;renderPortfolio();});
 document.querySelectorAll('[data-overview-kind]').forEach(b=>b.onclick=()=>{PORTFOLIO_FILTER={kind:b.dataset.overviewKind,value:b.dataset.overviewValue};renderPortfolio();document.getElementById('portfolio-filter-status').scrollIntoView({behavior:'smooth',block:'center'});});
}
function portfolioProjectedIncome(positions,month){return positions.reduce((sum,p)=>sum+capitalHeld(p)*positionReturn(p)/100*Math.min(month,Math.max(0,positionDates(p).remainingMonths))/12,0);}
function renderPortfolioProjection(positions,horizon){
 const values=Array.from({length:horizon+1},(_,i)=>portfolioProjectedIncome(positions,i)),max=Math.max(...values,1),w=1000,h=190,left=90,right=970,top=20,bottom=145;
 const x=i=>left+i/horizon*(right-left),y=v=>bottom-v/max*(bottom-top);
 const points=values.map((v,i)=>x(i)+','+y(v)).join(' ');
 let labels='';for(let i=0;i<=3;i++){const value=max*i/3,yy=y(value);labels+='<line x1="'+left+'" x2="'+right+'" y1="'+yy+'" y2="'+yy+'" stroke="#e3e8ee"/><text x="78" y="'+(yy+4)+'" text-anchor="end">'+usdS(value)+'</text>';}
 for(let i=0;i<=horizon;i+=horizon===12?3:1)labels+='<text x="'+x(i)+'" y="175" text-anchor="middle">'+(i?'Month '+i:'Today')+'</text>';
 document.getElementById('portfolio-projection-chart').innerHTML='<div class="projection-total">'+usdS(values[horizon])+' <span>expected over '+horizon+' months</span></div><svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Expected cumulative net income: '+usdS(values[horizon])+' over '+horizon+' months"><g font-size="12" fill="#647184">'+labels+'</g><polygon points="'+left+','+bottom+' '+points+' '+right+','+bottom+'" fill="#e8eff8"/><polyline points="'+points+'" fill="none" stroke="#285685" stroke-width="3"/></svg>';
}
