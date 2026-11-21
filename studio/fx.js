/* Prompt mode: the prompt drives the text, the picture/clip search and the transitions. */
(function(){
  const q=s=>document.querySelector(s);
  const isPost=()=>{const b=q('[data-m="post"]');return !!(b&&b.classList.contains('on'))};
  const PH_REEL='Write your prompt. Say the subject, the tone, how many lines, photos or clips, what to show, and the transitions. Example: 6 lines about discipline, cold voice, clips of ocean and storms, zoom transitions.';
  const sec=document.querySelectorAll('main > section.card');
  const h=sec[0]&&sec[0].querySelector('h2');if(h)h.innerHTML='<b>01</b>PROMPT';
  const setPH=()=>{if(!isPost())q('#subject').placeholder=PH_REEL};setPH();q('#subject').rows=5;
  document.addEventListener('click',e=>{if(e.target.closest('[data-m]'))setTimeout(setPH,0)});
  const st=sec[3];
  if(st){const d=document.createElement('div');
    d.innerHTML='<label for="trAll">Transition</label><select id="trAll"><option value="">As the prompt says</option><option value="fade">Fade</option><option value="slide">Slide</option><option value="zoom">Zoom</option><option value="flash">Flash</option><option value="cut">Cut</option></select>';
    st.appendChild(d)}
  const TR=['fade','slide','zoom','flash','cut'];
  const trOf=sc=>{const a=q('#trAll');const v=(a&&a.value)||sc.tr;return TR.indexOf(v)>=0?v:'fade'};
  const ease=p=>p<0?0:p>1?1:1-Math.pow(1-p,3);
  window.draw=function(t){
    const k=S.q;ctx.setTransform(k,0,0,k,0,0);
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.shadowBlur=0;
    ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
    const tl=timeline();if(!tl.length)return;
    const T=tl[tl.length-1].end;
    let i=tl.findIndex(x=>t<x.end);if(i<0)i=tl.length-1;
    const cur=tl[i],lt=t-cur.start,tr=trOf(cur.sc),F=tr==='cut'?0:tr==='fade'?0.45:0.55;
    let flash=0;
    if(i>0&&lt<F){
      const p=ease(lt/F),pv=tl[i-1].sc,plt=pv.dur+lt;
      if(tr==='slide'){
        ctx.save();ctx.translate(-W*p,0);drawBg(pv,plt,i-1,1);ctx.restore();
        ctx.save();ctx.translate(W*(1-p),0);drawBg(cur.sc,lt,i,1);ctx.restore();
      }else if(tr==='zoom'){
        const z1=1+0.35*p,z2=1.35-0.35*p;
        ctx.save();ctx.translate(W/2,H/2);ctx.scale(z1,z1);ctx.translate(-W/2,-H/2);drawBg(pv,plt,i-1,1);ctx.restore();
        ctx.save();ctx.translate(W/2,H/2);ctx.scale(z2,z2);ctx.translate(-W/2,-H/2);drawBg(cur.sc,lt,i,p);ctx.restore();
      }else if(tr==='flash'){drawBg(cur.sc,lt,i,1);flash=1-p}
      else{drawBg(pv,plt,i-1,1);drawBg(cur.sc,lt,i,lt/F)}
    }else drawBg(cur.sc,lt,i,1);
    if(S.style.bw){ctx.globalCompositeOperation='saturation';ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over'}
    ctx.fillStyle='rgba(0,0,0,'+S.style.dim+')';ctx.fillRect(0,0,W,H);
    const g=ctx.createRadialGradient(W/2,H/2,H*0.22,W/2,H/2,H*0.72);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.78)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    if(flash>0){ctx.fillStyle='rgba(255,255,255,'+(flash*0.9).toFixed(3)+')';ctx.fillRect(0,0,W,H)}
    if(S.style.brand)drawBrand();
    let a=1;const left=cur.sc.dur-lt;if(left<0.3&&i<tl.length-1)a=Math.max(0,left/0.3);
    drawText(cur.sc,lt,a);
    if(T-t<0.5){ctx.fillStyle='rgba(0,0,0,'+(1-Math.max(0,(T-t)/0.5))+')';ctx.fillRect(0,0,W,H)}
  };
  window.autoMedia=async function(){
    const mode=q('#mediaMode').value;let err=null;
    await Promise.all(S.scenes.map(async(sc,i)=>{
      const want=sc.mediaType==='clip'?'video':sc.mediaType==='photo'?'photo':(i%2?'video':'photo');
      const type=mode==='both'?want:mode;
      try{
        let items=await fetchItems(type,sc.visual||VISUALS[i%VISUALS.length]);
        if(!items.length&&type==='video')items=await fetchItems('photo',sc.visual||'marble statue');
        if(!items.length)items=await fetchItems('photo','marble statue');
        const pool=items.filter(x=>!used.has(x.id)).slice(0,7),list=pool.length?pool:items;
        const pick=list[Math.floor(Math.random()*list.length)];
        if(pick){used.add(pick.id);await setMedia(sc,pick)}
      }catch(e){err=e}
    }));
    if(err)toast(msg(err));
  };
  const PRE='THE USER PROMPT BELOW IS THE BOSS. Follow it for the subject, the tone, the number of lines (3 to 10), the wording, what the pictures show, photo or clip, and the transitions. If the prompt gives exact lines, use them word for word. Where the prompt conflicts with the rules above, the prompt wins. Where the prompt is silent, use the rules above. Add two more fields to every item in "lines": "media" = "photo" or "clip" (what the prompt asks; if it does not say, mix them), and "transition" = one of "fade", "slide", "zoom", "flash", "cut" for how that scene comes in (what the prompt asks; if it does not say, pick what fits the mood). "visual" must be a 2-3 word stock search that matches what the prompt wants shown.\nUSER PROMPT: ';
  document.addEventListener('click',async e=>{
    if(isPost()||!e.target.closest('#write'))return;
    e.stopPropagation();e.preventDefault();
    const b=q('#write');if(b.disabled)return;
    const text=q('#subject').value.trim();
    if(!text&&!S.shot){toast('Write a prompt or add a screenshot first.');return}
    if(playing)stop();
    b.disabled=true;b.textContent='Writing...';
    let ok=false;
    try{
      const d=await api('/api/script',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:PRE+(text||'(no text: read the screenshot and build the reel on its subject)'),image:S.shot})});
      ok=applyScript(d);
      if(ok){const ls=(d.lines||[]).filter(l=>l&&String(l.text||'').trim()).slice(0,10);
        S.scenes.forEach((sc,i)=>{const l=ls[i]||{};sc.mediaType=String(l.media||'').toLowerCase();sc.tr=String(l.transition||'').toLowerCase()})}
    }catch(x){
      if(/no_ai_key/.test(x.message)){
        if(text){ok=applyScript(localScript(text));toast('No AI key yet, so I used your own text as the lines. Add the free Gemini key in Keys so the prompt is followed.')}
        else toast('Reading a screenshot needs the free Gemini key. Add it in Keys.');
      }else toast(msg(x));
    }
    if(ok){b.textContent='Loading pictures...';await autoMedia()}
    b.disabled=false;b.textContent=isPost()?'Make my post':'Make my reel';
  },true);
  drawStill();
})();
