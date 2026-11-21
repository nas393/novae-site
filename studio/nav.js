/* NOVAE site nav (styles in /nav.css). Adds on every page:
   - desktop: slim sticky top bar, NOVAE logo = Home, + Studio (skipped on pages that already have one: body[data-ownbar])
   - mobile: fixed bottom bar Home / Studio / Menu, with a menu sheet listing every section
   - back-to-top button on long pages
   - prefetch of internal links on hover / touch / focus (Speculation Rules where supported) */
(function(){
  if(window.__lnav)return;window.__lnav=1;
  var d=document,b=d.body,path=location.pathname.replace(/\/index\.html$/,"/");
  var PAGES=[["/","Site","novae-mu.vercel.app"],["/studio","Studio","Reel + Post Maker"]];
  var here=function(h){return h==="/"?path==="/":path.indexOf(h.replace(/\/$/,""))===0;};
  var cur=function(h){return here(h)?' aria-current="page"':"";};
  var ico={
    home:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/></svg>',
    studio:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/></svg>',
    menu:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    up:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'
  };
  var add=function(html){var t=d.createElement("template");t.innerHTML=html;var el=t.content.firstElementChild;b.appendChild(el);return el;};

  if(!b.hasAttribute("data-ownbar")){
    add('<header class="ln-top"><a class="ln-logo" href="/" aria-label="NOVAE home">NOVAE</a><nav class="ln-links" aria-label="Site"><a href="/studio"'+cur("/studio")+'>Studio</a></nav></header>');
  }
  var inMenu=!here("/")&&!here("/studio");
  var bot=add('<nav class="ln-bot" aria-label="Site"><a href="/"'+cur("/")+'>'+ico.home+'Home</a><a href="/studio"'+cur("/studio")+'>'+ico.studio+'Studio</a><button type="button" aria-expanded="false" aria-controls="ln-sheet"'+(inMenu?' aria-current="page"':"")+'>'+ico.menu+'Menu</button></nav>');
  var sheet=add('<div class="ln-sheet" id="ln-sheet" role="dialog" aria-modal="true" aria-label="Menu"><nav>'+PAGES.map(function(p){return '<a href="'+p[0]+'"'+cur(p[0])+'>'+p[1]+'<span>'+p[2]+'</span></a>';}).join("")+'<a href="https://www.instagram.com/novae.brandstudio/" target="_blank" rel="noopener">Instagram<span>@novae.brandstudio</span></a></nav></div>');
  var mbtn=bot.querySelector("button");
  var setMenu=function(on){sheet.classList.toggle("on",on);mbtn.setAttribute("aria-expanded",on?"true":"false");if(on){var a=sheet.querySelector("a");a&&a.focus();}};
  mbtn.addEventListener("click",function(){setMenu(!sheet.classList.contains("on"));});
  sheet.addEventListener("click",function(e){if(e.target===sheet)setMenu(false);});
  d.addEventListener("keydown",function(e){if(e.key==="Escape"&&sheet.classList.contains("on")){setMenu(false);mbtn.focus();}});

  /* Back to top: after ~1 screen of scroll, only on pages at least 2 screens long */
  var up=add('<button type="button" class="ln-up" aria-label="Back to top">'+ico.up+'</button>');
  var reduce=matchMedia("(prefers-reduced-motion: reduce)");
  up.addEventListener("click",function(){scrollTo({top:0,behavior:reduce.matches?"auto":"smooth"});});
  var ticking=false;
  var onScroll=function(){ticking=false;var y=scrollY,h=innerHeight;
    up.classList.toggle("on",y>h&&d.documentElement.scrollHeight>h*2);
    b.classList.toggle("ln-scrolled",y>90);};
  addEventListener("scroll",function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});
  onScroll();

  /* Prefetch internal pages before the click */
  if(window.HTMLScriptElement&&HTMLScriptElement.supports&&HTMLScriptElement.supports("speculationrules")){
    var s=d.createElement("script");s.type="speculationrules";
    s.textContent=JSON.stringify({prefetch:[{source:"document",where:{and:[{href_matches:"/*"},{not:{href_matches:"/api/*"}}]},eagerness:"moderate"}]});
    d.head.appendChild(s);
  }else{
    var done={};
    var pf=function(e){var a=e.target.closest&&e.target.closest("a[href]");if(!a||a.origin!==location.origin||a.target==="_blank")return;
      var u=a.pathname;if(done[u]||u===location.pathname||u.indexOf("/api/")===0)return;done[u]=1;
      var l=d.createElement("link");l.rel="prefetch";l.href=u;d.head.appendChild(l);};
    ["mouseover","touchstart","focusin"].forEach(function(t){d.addEventListener(t,pf,{passive:true,capture:true});});
  }
})();
