(function(){
var H=document.documentElement;function LG(){return H.getAttribute('data-lang')==='pt'?'pt':'en'}
var STR={en:{title:'NOVAE · Marketing & brand studio in Luanda',lang:'Mudar para português',menu:'Menu',close:'Close menu',
  msg:function(b,u,p){return 'Hello NOVAE, I’d like a free positioning audit.\nBrand: '+b+(u?'\nInstagram / website: '+u:'')+'\nWhat’s holding us back: '+p},
  probs:['Nobody notices us','People choose on price','No time for content','Launching something new'],need:'Please fill in your brand and choose one option.'},
 pt:{title:'NOVAE · Estúdio de marketing e marca em Luanda',lang:'Switch to English',menu:'Menu',close:'Fechar menu',
  msg:function(b,u,p){return 'Olá NOVAE, gostaria de uma auditoria de posicionamento gratuita.\nMarca: '+b+(u?'\nInstagram / website: '+u:'')+'\nO que nos trava: '+p},
  probs:['Ninguém nos nota','Escolhem pelo preço','Sem tempo para conteúdo','Vamos lançar algo novo'],need:'Indique a sua marca e escolha uma opção.'}};
function S(k){return STR[LG()][k]}
function track(n,d){try{window.va&&window.va('event',{name:n,data:d})}catch(e){}}
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
// language
function applyLang(l){H.setAttribute('data-lang',l);H.lang=l==='pt'?'pt-AO':'en';try{localStorage.setItem('novae-lang',l)}catch(e){}
 document.querySelectorAll('[data-l]').forEach(function(el){el.getAttribute('data-l').split(',').forEach(function(a){var v=el.getAttribute((a.indexOf('data-')===0?a:'data-'+a)+'-'+l);if(v!=null)el.setAttribute(a,v)})});
 document.title=S('title');document.querySelectorAll('.lang').forEach(function(b){b.setAttribute('aria-label',S('lang'))})}
document.querySelectorAll('.lang').forEach(function(b){b.addEventListener('click',function(){applyLang(LG()==='pt'?'en':'pt');track('Language',{to:LG()})})});
applyLang(LG());
// header + menu
var hd=document.querySelector('.hd'),sheet=document.getElementById('sheet'),mb=document.getElementById('menu');
addEventListener('scroll',function(){hd.classList.toggle('scrolled',scrollY>8)},{passive:true});
function menu(o){sheet.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?S('close'):S('menu'));if(o)sheet.querySelector('a').focus()}
mb.addEventListener('click',function(){menu(!sheet.classList.contains('open'))});
sheet.addEventListener('click',function(e){if(e.target.closest('a'))menu(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){menu(false);closeLb()}});
// reveal on scroll
var rv=[].slice.call(document.querySelectorAll('.rv'));
if(RM||!('IntersectionObserver' in window))rv.forEach(function(el){el.classList.add('in')});
else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});rv.forEach(function(el){io.observe(el)})}
// sticky contact bar: after the hero, hidden over the audit section
var bar=document.getElementById('mbar'),hero=document.getElementById('top'),aud=document.getElementById('audit-sec'),pastHero=false,atAudit=false;
function upd(){bar.classList.toggle('on',pastHero&&!atAudit)}
if('IntersectionObserver' in window){new IntersectionObserver(function(es){pastHero=!es[0].isIntersecting;upd()},{threshold:.15}).observe(hero);new IntersectionObserver(function(es){atAudit=es[0].isIntersecting;upd()},{threshold:.2}).observe(aud)}else bar.classList.add('on');
// films
var lb=document.getElementById('lb'),vid=document.getElementById('vid'),last=null;
document.addEventListener('click',function(e){var b=e.target.closest('[data-film]');if(b){last=b;vid.poster=b.dataset.poster;vid.src=b.dataset.film;document.getElementById('vt').textContent=b.dataset.title;lb.hidden=false;vid.play().catch(function(){});document.getElementById('lbx').focus();track('Film played',{film:b.dataset.film})}
 var a=e.target.closest('a[href*="wa.me"]');if(a)track('WhatsApp click',{from:a.dataset.src||'link'});
 var c=e.target.closest('[data-cta]');if(c)track('CTA',{cta:c.dataset.cta});
 var bk=e.target.closest('a[href="book"]');if(bk)track('Book opened',{from:bk.dataset.src||'link'})});
function closeLb(){if(!lb.hidden){vid.pause();vid.removeAttribute('src');vid.load();lb.hidden=true;last&&last.focus()}}
document.getElementById('lbx').onclick=closeLb;lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
// free audit
var f=document.getElementById('audit'),fs=f.querySelector('fieldset'),er=document.getElementById('auderr'),st=document.getElementById('sent'),started=false;
f.addEventListener('input',function(e){if(!started){started=true;track('Audit started')}e.target.classList&&e.target.classList.remove('bad')});
f.addEventListener('change',function(){fs.classList.remove('bad')});
f.addEventListener('submit',function(e){e.preventDefault();var b=f.elements.b,u=f.elements.u.value.trim(),c=f.querySelector('[name=p]:checked'),ok=true;
 if(!b.value.trim()){b.classList.add('bad');ok=false}if(!c){fs.classList.add('bad');ok=false}
 if(!ok){er.textContent=S('need');(b.value.trim()?f.querySelector('[name=p]'):b).focus();return}er.textContent='';
 var url='https://wa.me/'+f.dataset.wa+'?text='+encodeURIComponent(S('msg')(b.value.trim(),u,S('probs')[+c.value]));
 track('Audit sent',{problem:STR.en.probs[+c.value]});window.open(url,'_blank','noopener');
 document.getElementById('sentwa').href=url;f.hidden=true;st.hidden=false;st.focus({preventScroll:true})});
document.getElementById('edit').addEventListener('click',function(){st.hidden=true;f.hidden=false;f.elements.b.focus()});
})();
