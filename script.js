(function(){
  var $=function(i){return document.getElementById(i)};
  var pays=[];
  var fmt=function(n){return n.toLocaleString('en-US',{maximumFractionDigits:2})};
  var usdf=function(n){return '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})};
  function rate(){var r=parseFloat($('rate').value.replace(/,/g,''));return r>0?r:0}
  function build(){
    var r=rate(),tot=pays.reduce(function(s,p){return s+p.a},0),each=$('each').checked;
    var lines=pays.length?pays.map(function(p){
      var t='৳'+fmt(p.a);if(p.n)t+=' ('+p.n+')';
      if(each&&r)t+=' = '+usdf(p.a/r);return t}).join('\n'):'—';
    return '**USD Calculation**\n\n'+lines+'\n──────────\nTotal: ৳'+fmt(tot)+'\nRate: ৳'+(r?fmt(r):'—')+'\nDollar: **'+usdf(r?tot/r:0)+'**';
  }
  function render(){
    var r=rate(),tot=pays.reduce(function(s,p){return s+p.a},0);
    $('usd').textContent=usdf(r?tot/r:0);
    $('bdt').textContent='৳'+fmt(tot);
    $('cnt').textContent=pays.length;
    $('empty').style.display=pays.length?'none':'block';
    var ul=$('list');ul.innerHTML='';ul.style.display=pays.length?'block':'none';
    pays.forEach(function(p,i){
      var li=document.createElement('li');
      var a=document.createElement('span');a.className='a';a.textContent='৳'+fmt(p.a);
      var n=document.createElement('span');n.className='n';n.textContent=p.n;
      var b=document.createElement('button');b.textContent='×';b.setAttribute('aria-label','Remove payment');
      b.onclick=function(){pays.splice(i,1);render()};
      li.appendChild(a);li.appendChild(n);li.appendChild(b);ul.appendChild(li);
    });
    $('sum').textContent=build();
  }
  function add(){
    var a=parseFloat($('amt').value.replace(/,/g,''));if(!(a>0)){$('amt').focus();return}
    pays.push({a:a,n:$('note').value.trim()});
    $('amt').value='';$('note').value='';$('amt').focus();render();
  }
  $('add').onclick=add;
  $('amt').addEventListener('keydown',function(e){if(e.key==='Enter')add()});
  $('note').addEventListener('keydown',function(e){if(e.key==='Enter')add()});
  $('rate').addEventListener('input',render);
  $('each').addEventListener('change',render);
  $('reset').onclick=function(){pays=[];$('rate').value='';$('amt').value='';$('note').value='';$('each').checked=false;render()};
  $('copy').onclick=function(){
    var t=build(),b=$('copy');
    function done(){b.textContent='Copied!';setTimeout(function(){b.textContent='Copy Summary'},1500)}
    function fallback(){var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}document.body.removeChild(ta);done()}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,fallback)}else fallback();
  };
  $('theme').onclick=function(){
    var d=document.documentElement,cur=d.getAttribute('data-theme');
    if(!cur)cur=matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';
    var nx=cur==='dark'?'light':'dark';d.setAttribute('data-theme',nx);try{localStorage.setItem('theme',nx)}catch(e){}
  };
  render();
})();
