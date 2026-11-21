/* NOVAE Studio: content language (PT for Angola by default, or EN). Adds "lang" to every AI request. */
(function(){
  var K='novae_lang';
  var get=function(){try{return localStorage.getItem(K)==='en'?'en':'pt'}catch(e){return 'pt'}};
  var f=window.fetch;
  window.fetch=function(u,o){
    try{if(typeof u==='string'&&u.indexOf('/api/script')===0&&o&&typeof o.body==='string'){var b=JSON.parse(o.body);b.lang=get();o=Object.assign({},o,{body:JSON.stringify(b)})}}catch(e){}
    return f.apply(this,[u,o]);
  };
  var add=function(){
    var h=document.querySelector('header');if(!h||document.getElementById('nvLang'))return;
    var s=document.createElement('style');s.textContent='#nvLang{margin-left:auto;margin-right:10px;padding:6px 12px;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--ink);font:600 12px Inter,sans-serif;letter-spacing:.08em;cursor:pointer}#nvLang:focus-visible{outline:2px solid var(--gold);outline-offset:2px}#nvLang b{color:var(--gold)}';document.head.appendChild(s);
    var b=document.createElement('button');b.type='button';b.id='nvLang';
    var draw=function(){var l=get();b.innerHTML=l==='pt'?'<b>PT</b> · EN':'PT · <b>EN</b>';b.setAttribute('aria-label','Content language: '+(l==='pt'?'Portuguese':'English')+'. Tap to switch.')};
    b.onclick=function(){try{localStorage.setItem(K,get()==='pt'?'en':'pt')}catch(e){}draw()};
    draw();h.insertBefore(b,h.lastElementChild);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();
