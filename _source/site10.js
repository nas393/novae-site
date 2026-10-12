
(function(){
function track(n,d){try{window.va&&window.va('event',{name:n,data:d})}catch(e){}}
// accessible tabs: services and process steps
[['.tl','Service tab'],['.tl2','Process step']].forEach(function(s){
 document.querySelectorAll(s[0]).forEach(function(list){
  var tabs=[].slice.call(list.querySelectorAll('[role=tab]'));
  function sel(t,focus){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on});
   if(focus)t.focus();t.scrollIntoView&&list.scrollWidth>list.clientWidth&&t.scrollIntoView({block:'nearest',inline:'nearest'})}
  tabs.forEach(function(t,i){
   t.addEventListener('click',function(){if(t.getAttribute('aria-selected')!=='true'){sel(t);track(s[1],{tab:t.id})}});
   t.addEventListener('keydown',function(e){var j=null;if(e.key==='ArrowRight')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=tabs.length-1;
    if(j!==null){e.preventDefault();sel(tabs[j],true)}})})})});
// phones: the included list starts folded
if(window.matchMedia&&matchMedia('(max-width:960px)').matches)document.querySelectorAll('details.inc').forEach(function(d){d.open=false});
document.querySelectorAll('details.inc,details.more').forEach(function(d){d.addEventListener('toggle',function(){if(d.open)track('Detail opened',{what:d.className})})});
})();
(function(){var s=document.querySelector('#work .shots'),d=document.querySelectorAll('#work .dots i');if(!s||!d.length)return;
 var t;s.addEventListener('scroll',function(){cancelAnimationFrame(t);t=requestAnimationFrame(function(){var f=s.querySelectorAll('figure'),w=f[1]?f[1].offsetLeft-f[0].offsetLeft:1,i=Math.round(s.scrollLeft/w);if(s.scrollLeft+s.clientWidth>=s.scrollWidth-4)i=f.length-1;d.forEach(function(x,j){x.classList.toggle('on',j===i)})})},{passive:true})})();
// hero pillars open the matching service tab
document.querySelectorAll('.pillars [data-tab]').forEach(function(a){a.addEventListener('click',function(){var t=document.getElementById(a.dataset.tab);if(t)t.click()})});
