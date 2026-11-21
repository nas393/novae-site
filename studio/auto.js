/* Autopilot + locked NOVAE theme + red light effect + themed post/cover renderer + subject ideas. */
(function(){
  const q=s=>document.querySelector(s),main=q('main'),PW=1080,RED='#C9A24A';
  const secs=[...document.querySelectorAll('main > section.card')];
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  /* ---- locked theme ---- */
  Object.assign(S.style,{font:'EB Garamond',pos:'center',accent:RED,size:84,dim:0.42,bw:true,upper:true,brand:true,brandText:'NOVAE'});
  WEIGHT['Cinzel']=500;
  if(secs[3])secs[3].style.display='none';
  function redFx(c,w,h){
    c.save();c.globalAlpha=1;c.shadowBlur=0;c.globalCompositeOperation='overlay';
    let g=c.createLinearGradient(w,0,w*0.45,h*0.5);g.addColorStop(0,'rgba(235,0,25,.6)');g.addColorStop(1,'rgba(235,0,25,0)');c.fillStyle=g;c.fillRect(0,0,w,h);
    c.globalCompositeOperation='screen';
    g=c.createRadialGradient(w*0.88,h*0.78,0,w*0.88,h*0.78,h*0.5);g.addColorStop(0,'rgba(190,0,20,.22)');g.addColorStop(1,'rgba(190,0,20,0)');c.fillStyle=g;c.fillRect(0,0,w,h);
    c.restore();
  }
  const oldBrand=drawBrand;window.drawBrand=function(){redFx(ctx,W,H);oldBrand()};
  /* ---- themed still renderer (post, cover) ---- */
  function spaced(c,txt,x,y,sp){for(const ch of txt){c.fillText(ch,x,y);x+=c.measureText(ch).width+sp}}
  function spacedW(c,txt,sp){let w=0;for(const ch of txt)w+=c.measureText(ch).width+sp;return w-sp}
  function wrapW(c,words,maxW,sp){const lines=[];let cur='';for(const w of words){const t=cur?cur+' '+w:w;if(cur&&(sp?spacedW(c,t,sp):c.measureText(t).width)>maxW){lines.push(cur);cur=w}else cur=t}if(cur)lines.push(cur);return lines}
  function still(sc,PH,idx,n,cvs){return window.LT.still(sc,PH,idx,n,cvs)}
  const toBlob=cv=>new Promise(r=>cv.toBlob(r,'image/png'));
  let urls=[];
  async function makeImages(list,PH,prefix){
    try{await fontsReady();await Promise.all([document.fonts.load('500 84px "Cinzel"'),document.fonts.load('600 23px "Montserrat"')])}catch(e){}
    const out=[],stamp=Date.now();
    for(let i=0;i<list.length;i++){const b=await toBlob(still(list[i],PH,i,list.length));if(!b)throw new Error('render');
      const name='novae-'+prefix+'-'+stamp+'-'+(i+1)+'.png',url=URL.createObjectURL(b);urls.push(url);
      let file=null;try{file=new File([b],name,{type:'image/png'})}catch(e){}out.push({name,url,file})}
    return out;
  }
  function gridHtml(items,label){return '<div class="pgrid">'+items.map((x,i)=>'<a download="'+x.name+'" href="'+x.url+'" aria-label="Download '+label+' '+(i+1)+'"><img src="'+x.url+'" alt="'+label+' '+(i+1)+'" style="width:100%;border-radius:8px;border:1px solid var(--line);display:block"></a>').join('')+'</div>'}
  function shareBtn(host,items,title){const files=items.map(x=>x.file).filter(Boolean);let ok=false;try{ok=files.length===items.length&&!!(navigator.canShare&&navigator.canShare({files}))}catch(e){}
    if(!ok)return;const b=document.createElement('button');b.className='mt';b.textContent='Share '+title;b.onclick=()=>navigator.share({files,title:'NOVAE'}).catch(()=>{});host.appendChild(b)}
  /* ---- post tab uses the themed renderer too ---- */
  const oldPrev=q('#postPrev');let prevCv=null;
  if(oldPrev){prevCv=document.createElement('canvas');prevCv.width=PW;prevCv.height=1350;prevCv.style.aspectRatio='auto';oldPrev.replaceWith(prevCv)}
  const isPost=()=>{const b=q('[data-m="post"]');return !!(b&&b.classList.contains('on'))};
  setInterval(()=>{const v=main.dataset.view;if(prevCv&&isPost()&&S.scenes.length&&!document.hidden&&(!v||v==='post')){const i=Math.min(S.sel,S.scenes.length-1);still(S.scenes[i],+q('#postSize').value,i,S.scenes.length,prevCv)}},700);
  if(q('#postGo'))q('#postGo').onclick=async()=>{const b=q('#postGo'),out=q('#postOut');b.disabled=true;b.textContent='Making...';
    try{const it=await makeImages(S.scenes,+q('#postSize').value,'post');out.innerHTML=gridHtml(it,'slide')+'<p class="hint">Tap an image to download it.</p>';shareBtn(out,it,'all images');toast('Post images ready.')}
    catch(e){toast('Could not make the post images. Try again.')}
    b.disabled=false;b.textContent='Make post images'};
  /* ---- autopilot card ---- */
  const card=document.createElement('section');card.className='card';card.style.borderColor=RED;
  card.innerHTML='<h2><b>GO</b>AUTOPILOT</h2>'+
    '<input id="apSub" type="text" placeholder="Write one subject. Example: como atrair mais clientes">'+
    '<div class="row mt"><button id="apIdeas" class="ghost">Suggest subjects</button></div>'+
    '<div class="chips mt" id="apChips"></div>'+
    '<button id="apGo" class="primary mt">Make everything</button>'+
    '<p class="hint" id="apStat">One tap makes the reel, the carousel post, the reel cover and the caption. Keep this page open.</p>'+
    '<div id="apOut"></div>';
  main.insertBefore(card,main.querySelector('.chips'));
  const stat=t=>{q('#apStat').textContent=t};
  const BASE=' Follow the NOVAE voice rules above.';
  const PRE_IDEAS='IDEAS REQUEST. Do not write a reel. Give 8 fresh subject ideas for the NOVAE page (brand strategy, positioning, visual identity, content, websites and campaigns for founders and growing businesses in Angola). Return the usual JSON where "lines" has 8 items and each "text" is one subject idea of 4 to 9 words. Set "accent" and "visual" to "".\nFOCUS: ';
  const PRE_AUTO='AUTOPILOT REQUEST. From the subject, plan a full content pack.'+BASE+' Return the usual JSON plus extra keys. "lines" is the REEL: 5 or 6 items; add to each item "media" ("photo" or "clip"; mix them; item 1 is a clip) and "transition" (one of "fade","slide","zoom","flash","cut"; vary them). "post" is a CAROUSEL: an array of exactly 5 items {"text","accent","sub","visual"}; "text" is a headline of 4 to 9 words in sentence case that ends with a period; "sub" is a category label of 1 to 3 words such as "The mind", "Human behaviour", "Self-mastery", "Influence and power", "Mental patterns"; item 1 is the hook; item 5 tells the reader to save the post and follow @novae.brandstudio. "cover" is one item {"text","accent","sub"} for the reel cover with the same headline rule. Every "visual" is a 2-3 word stock search, dark and classical: statue, marble bust, lion, chess, hourglass, storm, mountain, chains, helmet, columns. Also "caption", "hashtags", "sound" as usual.\nSUBJECT: ';
  const post=(text)=>api('/api/script',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text})});
  q('#apIdeas').onclick=async()=>{const b=q('#apIdeas');b.disabled=true;b.textContent='Thinking...';
    try{const d=await post(PRE_IDEAS+(q('#apSub').value.trim()||'any'));
      q('#apChips').innerHTML=(d.lines||[]).slice(0,8).map(l=>'<button class="ghost" data-s="'+esc(l.text)+'" style="text-align:left">'+esc(l.text)+'</button>').join('')}
    catch(e){toast(msg(e))}
    b.disabled=false;b.textContent='Suggest subjects'};
  q('#apChips').onclick=e=>{const b=e.target.closest('[data-s]');if(b)q('#apSub').value=b.dataset.s};
  const tab=m=>{const b=q('[data-m="'+m+'"]');if(b&&!b.classList.contains('on'))b.click()};
  const mkS=l=>{const s=mk(String(l.text||'').trim(),String(l.accent||'').trim(),String(l.visual||'').trim());s.sub=String(l.sub||'').trim();return s};
  async function autoSound(query){
    try{const d=await api('/api/sounds?q='+encodeURIComponent(query||'elegant piano'));
      const c=(d.items||[]).filter(x=>x.dur>=15&&x.dur<=150).slice(0,5);if(!c.length)throw 0;
      const it=c[Math.floor(Math.random()*c.length)],r=await fetch('/api/proxy?u='+encodeURIComponent(it.url));if(!r.ok)throw 0;
      S.sound.buffer=await decode(await r.arrayBuffer());S.sound.kind='buffer';S.sound.title=it.title+(it.by?' by '+it.by:'')+' ('+(it.license||'CC0')+')';
    }catch(e){S.sound.kind='drone'}
    setSoundUI();
  }
  let running=false;
  q('#apGo').onclick=async()=>{
    if(running||busy)return;
    const sub=q('#apSub').value.trim();if(!sub){toast('Write one subject first.');return}
    running=true;const b=q('#apGo'),out=q('#apOut');b.disabled=true;out.innerHTML='';
    try{ac()}catch(e){}
    if(playing)stop();
    try{
      stat('1/6 Writing the reel, the post and the caption...');tab('reel');
      const d=await post(PRE_AUTO+sub);
      q('#subject').value=sub;
      if(!applyScript({lines:d.lines,caption:d.caption,hashtags:d.hashtags,sound:d.sound}))throw new Error('ai_empty');
      const ls=(d.lines||[]).filter(l=>l&&String(l.text||'').trim()).slice(0,10);
      S.scenes.forEach((sc,i)=>{const l=ls[i]||{};sc.mediaType=String(l.media||'').toLowerCase();sc.tr=String(l.transition||'').toLowerCase()});
      const cap=q('#caption').value;
      stat('2/6 Finding pictures and clips for the reel...');q('#mediaMode').value='both';await autoMedia();
      stat('3/6 Picking a free sound...');await autoSound(d.sound);
      stat('4/6 Building the carousel post...');
      const slides=(Array.isArray(d.post)&&d.post.length?d.post:d.lines).filter(l=>l&&String(l.text||'').trim()).slice(0,8).map(mkS);
      tab('post');q('#subject').value=sub;S.scenes=slides;S.sel=0;renderScenes();
      const mm=q('#mediaMode');mm.value='photo';const p=autoMedia();mm.value='both';await p;
      const imgs=await makeImages(S.scenes,1350,'post');
      stat('5/6 Making the reel cover...');
      const cv0=mkS(d.cover&&d.cover.text?d.cover:(d.post&&d.post[0])||d.lines[0]);cv0.media=S.scenes[0]&&S.scenes[0].media;
      const cover=await makeImages([cv0],1920,'cover');
      if(q('#postCap'))q('#postCap').value=cap;
      tab('reel');
      out.innerHTML='<label>Carousel post (tap to download)</label>'+gridHtml(imgs,'slide')+'<div id="apS1"></div><label>Reel cover</label>'+gridHtml(cover,'cover')+
        '<label for="apCap">Caption</label><textarea id="apCap" rows="5"></textarea><button id="apCopy" class="ghost mt">Copy caption</button><label>Reel video</label><div id="apReel"><p class="hint">Recording...</p></div>';
      q('#apCap').value=cap;shareBtn(q('#apS1'),imgs,'all slides');
      q('#apCopy').onclick=async()=>{const t=q('#apCap');try{await navigator.clipboard.writeText(t.value);toast('Caption copied.')}catch(e){t.select();toast('Select and copy the text.')}};
      stat('6/6 Recording the reel. Keep this page open and on screen...');
      await wait(300);q('#export').click();await wait(600);
      const t0=Date.now();while(busy&&Date.now()-t0<180000)await wait(400);
      await wait(400);
      const res=q('#result');
      if(res&&res.querySelector('video')){const host=q('#apReel');host.innerHTML='';while(res.firstChild)host.appendChild(res.firstChild);stat('Done. Everything is ready below. Tap to download or share.');toast('All ready.')}
      else{q('#apReel').innerHTML='<p class="hint">The reel was not recorded. Tap Export reel in the REEL tab.</p>';stat('Post, cover and caption are ready. The reel needs one more tap: Export reel.')}
    }catch(e){tab('reel');stat('Stopped: '+msg(e));toast(msg(e))}
    running=false;b.disabled=false;
  };
  drawStill();
})();
