/* Studio layout: "one big button first". Loaded last by api/page.js, after every Studio script.
   It only regroups existing cards (ids and handlers untouched):
   - Home (#): Autopilot (subject + MAKE EVERYTHING), then 4 tiles: Reel, Post, PDF, Week plan, then My images.
   - A tile opens only that tool (#reel, #post, #pdf, #week) with a "← Studio" back link. Browser Back works.
   - Long editing steps (Scenes, Style, Sound) are folded; tap the title to open. */
(function(){
  var main=document.querySelector('main');
  if(!main||main.dataset.sv)return;main.dataset.sv='1';
  var cards=[].slice.call(main.querySelectorAll(':scope > section.card'));
  var find=function(re){return cards.filter(function(c){var h=c.querySelector('h2');return h&&re.test(h.textContent.replace(/\s+/g,' '));})[0];};
  var C={auto:find(/AUTOPILOT/),pdf:find(/BOOK|GUIDE|FLYER/),week:find(/WEEK PLAN/),imgs:find(/MY\s*IMAGES|IMAGES$/),
    prompt:find(/PROMPT/),preview:find(/PREVIEW/),scenes:find(/SCENES/),style:find(/STYLE/),sound:find(/SOUND/),
    exp:find(/EXPORT/),postimg:find(/POST IMAGES/)};
  var chips=main.querySelector(':scope > .chips');
  if(!C.auto||!C.prompt)return; // unexpected page: leave the original layout alone

  var st=document.createElement('style');
  st.textContent=[
    'main[data-view] .sv-t{display:none!important}',
    'main[data-view=reel] .sv-make,main[data-view=post] .sv-make,main[data-view=pdf] .sv-pdf,main[data-view=week] .sv-week,main[data-view=home] .sv-imgs.open{display:block!important}',
    'main[data-view=reel] .sv-make.sv-hide,main[data-view=post] .sv-make.sv-hide{display:none!important}',
    'main:not([data-view=home]) .sv-home{display:none!important}',
    'main[data-view=home] .sv-back{display:none}',
    '.sv-chips{display:none!important}',
    '.sv-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 14px}',
    '.sv-tile{display:flex;flex-direction:column;justify-content:flex-start;gap:16px;min-height:112px;padding:16px;border:1px solid var(--line);border-radius:14px;background:var(--card);color:var(--ink);text-decoration:none;-webkit-tap-highlight-color:transparent;transition:border-color .15s}',
    '.sv-tile:hover,.sv-tile:focus-visible{border-color:var(--red);outline:none}',
    '.sv-tile svg{width:26px;height:26px;stroke:var(--red);fill:none;stroke-width:1.6}',
    '.sv-tile b{display:block;font:600 15px Cinzel,serif;letter-spacing:.18em}',
    '.sv-tile small{display:block;color:var(--mute);font-size:12px;margin-top:3px;line-height:1.35}',
    '.sv-row{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:52px;padding:0 16px;margin:0 0 14px;border:1px solid var(--line);border-radius:14px;background:transparent;color:var(--ink);font:600 12px Montserrat,sans-serif;letter-spacing:.2em;text-transform:uppercase;cursor:pointer}',
    '.sv-row span{color:var(--mute);transition:transform .15s}.sv-row[aria-expanded=true] span{transform:rotate(90deg)}',
    '.sv-back{display:flex;align-items:center;gap:10px;min-height:44px;margin:0 0 12px;color:var(--ink);text-decoration:none;font:600 12px Montserrat,sans-serif;letter-spacing:.2em;text-transform:uppercase}',
    '.sv-back i{font-style:normal;color:var(--red);font-size:18px}',
    '.sv-back em{font-style:normal;color:var(--mute);margin-left:auto;letter-spacing:.1em;text-transform:none;font-weight:500}',
    '.sv-fold>h2{cursor:pointer;position:relative;padding-right:76px}',
    '.sv-fold>h2::after{content:"Edit \\25B8";position:absolute;right:0;top:50%;transform:translateY(-50%);font:600 11px Montserrat,sans-serif;letter-spacing:.12em;color:var(--mute)}',
    '.sv-fold.open>h2::after{content:"Close \\25BE"}',
    '.sv-fold:not(.open)>:not(h2){display:none!important}',
    '.sv-fold:not(.open){padding-bottom:4px}'
  ].join('\n');
  document.head.appendChild(st);

  var tag=function(el,cls){if(el)cls.split(' ').forEach(function(c){el.classList.add(c);});};
  tag(C.auto,'sv-home');
  [C.pdf,C.week,C.imgs,C.prompt,C.preview,C.scenes,C.style,C.sound,C.exp,C.postimg].forEach(function(c){tag(c,'sv-t');});
  [C.prompt,C.preview,C.scenes,C.style,C.sound,C.exp,C.postimg].forEach(function(c){tag(c,'sv-make');});
  tag(C.pdf,'sv-pdf');tag(C.week,'sv-week');tag(C.imgs,'sv-imgs');
  if(chips)chips.classList.add('sv-chips');

  /* post.js shows/hides reel-only and post-only cards with inline display:none: respect that inside a tool view */
  var syncHidden=function(){[C.prompt,C.preview,C.scenes,C.style,C.sound,C.exp,C.postimg].forEach(function(c){if(c)c.classList.toggle('sv-hide',c.style.display==='none');});};
  new MutationObserver(syncHidden).observe(main,{subtree:true,attributes:true,attributeFilter:['style']});
  syncHidden();

  /* Fold the long editing steps */
  [C.scenes,C.style,C.sound].forEach(function(c){if(!c)return;c.classList.add('sv-fold');var h=c.querySelector('h2');
    h.setAttribute('role','button');h.tabIndex=0;h.setAttribute('aria-expanded','false');
    var t=function(){var o=c.classList.toggle('open');h.setAttribute('aria-expanded',o?'true':'false');};
    h.addEventListener('click',t);h.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();t();}});});

  var ico={
    reel:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/></svg>',
    post:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>',
    pdf:'<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/></svg>',
    week:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>'
  };
  var TOOLS={reel:['Reel','Video with scenes, sound and caption'],post:['Post','Carousel images + caption'],pdf:['PDF','Book, guide or flyer'],week:['Week plan','7 subjects, one per day']};
  var grid=document.createElement('nav');grid.className='sv-grid sv-home';grid.setAttribute('aria-label','Studio tools');
  grid.innerHTML=Object.keys(TOOLS).map(function(k){return '<a class="sv-tile" href="#'+k+'">'+ico[k]+'<span><b>'+TOOLS[k][0].toUpperCase()+'</b><small>'+TOOLS[k][1]+'</small></span></a>';}).join('');
  C.auto.after(grid);

  var more=null;
  if(C.imgs){more=document.createElement('button');more.type='button';more.className='sv-row sv-home';more.setAttribute('aria-expanded','false');
    more.innerHTML='My images <span>▸</span>';grid.after(more);more.after(C.imgs);
    more.addEventListener('click',function(){var o=C.imgs.classList.toggle('open');more.setAttribute('aria-expanded',o?'true':'false');});}

  var back=document.createElement('a');back.className='sv-back';back.href='#';back.innerHTML='<i>←</i> Studio <em></em>';
  main.insertBefore(back,C.auto);

  var modeBtn=function(m){return chips&&chips.querySelector('[data-m="'+m+'"]');};
  var show=function(v){
    if(!TOOLS[v])v='home';
    if((v==='reel'||v==='post')&&modeBtn(v)&&!modeBtn(v).classList.contains('on'))modeBtn(v).click();
    main.dataset.view=v;back.querySelector('em').textContent=TOOLS[v]?TOOLS[v][0]:'';
    syncHidden();
  };
  var fromHash=function(){show(location.hash.slice(1));};
  addEventListener('hashchange',function(){fromHash();scrollTo(0,0);});
  /* Week plan "Make" runs Autopilot, which lives on the Studio home: go there so its progress is visible */
  var wk=document.getElementById('wkList');
  if(wk)wk.addEventListener('click',function(e){if(e.target.closest('[data-w]')){if(location.hash)history.replaceState(null,'',location.pathname);show('home');}},true);
  /* Keys: a clear first step on the Studio home while the free keys are missing */
  var keyOf=function(k){try{return localStorage.getItem('lrm_'+k)||''}catch(e){return ''}};
  var kb=document.createElement('div');kb.className='sv-keys sv-home';kb.setAttribute('role','status');
  var ks=document.createElement('style');
  ks.textContent='.sv-keys{display:flex;align-items:center;gap:12px;margin:0 0 14px;padding:14px;border:1px solid var(--red);border-radius:14px;background:#211c12}'+
    '.sv-keys p{margin:0;flex:1;font-size:13.5px;line-height:1.4}.sv-keys b{display:block;font:600 12px Montserrat,sans-serif;letter-spacing:.18em;margin-bottom:3px}'+
    '.sv-keys button{flex:0 0 auto;background:var(--red);border-color:var(--red);color:#fff}.sv-keys[hidden]{display:none!important}';
  document.head.appendChild(ks);
  var paintKeys=function(){var p=keyOf('pexels'),g=keyOf('gemini');
    kb.hidden=!!(p&&g);if(kb.hidden)return;
    var miss=!p&&!g?'2 free keys':!g?'the free Gemini key':'the free Pixabay key';
    kb.innerHTML='<p><b>FIRST STEP</b>Add '+miss+' so AI can write and find photos. Takes 2 minutes, free.</p><button type="button">Add keys</button>';
    kb.querySelector('button').onclick=function(){var o=document.getElementById('openSet');o&&o.click();};};
  main.insertBefore(kb,C.auto);paintKeys();
  var save=document.getElementById('saveSet');if(save)save.addEventListener('click',function(){setTimeout(paintKeys,0);});

  /* Recording and Autopilot need the screen on: keep it awake while they run, and warn before leaving */
  var apGo=document.getElementById('apGo'),lock=null;
  var working=function(){var rec=false;try{rec=!!busy;}catch(e){}return rec||!!(apGo&&apGo.disabled);};
  var wake=function(){var on=working()&&!document.hidden;
    if(on&&!lock&&navigator.wakeLock){navigator.wakeLock.request('screen').then(function(l){lock=l;l.addEventListener('release',function(){lock=null;});}).catch(function(){});}
    else if(!on&&lock){lock.release().catch(function(){});lock=null;}};
  setInterval(wake,1000);document.addEventListener('visibilitychange',wake);
  addEventListener('beforeunload',function(e){if(working()){e.preventDefault();e.returnValue='';}});

  /* Accessibility: name the PDF type picker */
  var dt=document.getElementById('dcType');if(dt&&!dt.getAttribute('aria-label')&&!document.querySelector('label[for="dcType"]'))dt.setAttribute('aria-label','PDF type');

  fromHash();
})();
