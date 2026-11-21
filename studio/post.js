/* Post maker: its own tab, its own subject, text and pictures. Shares the engine and the style. */
(function(){
  const $$=s=>document.querySelector(s),main=$$('main');
  const secs=[...document.querySelectorAll('main > section.card')];
  const tabs=document.createElement('div');tabs.className='chips';tabs.style.marginBottom='14px';
  tabs.innerHTML='<button data-m="reel" class="on" style="flex:1">REEL</button><button data-m="post" style="flex:1">POST</button>';
  main.insertBefore(tabs,secs[0]);
  const card=document.createElement('section');card.className='card';card.style.display='none';
  card.innerHTML='<h2><b>GO</b>POST IMAGES</h2>'+
    '<div class="stage"><canvas id="postPrev" width="1080" height="1350" style="aspect-ratio:auto"></canvas></div>'+
    '<label for="postSize">Post size</label>'+
    '<select id="postSize"><option value="1350">Portrait 1080 x 1350 (best for feed)</option><option value="1080">Square 1080 x 1080</option><option value="1920">Story 1080 x 1920</option></select>'+
    '<label class="check"><input id="postNum" type="checkbox" checked>Show slide number</label>'+
    '<button id="postGo" class="primary mt">Make post images</button>'+
    '<p class="hint">Each slide becomes one image. One slide = single post. Many slides = carousel.</p>'+
    '<div id="postOut"></div>'+
    '<label for="postCap">Caption</label><textarea id="postCap" rows="5" placeholder="Caption and hashtags show here."></textarea>'+
    '<button id="postCopy" class="ghost mt">Copy caption</button>';
  main.appendChild(card);
  const PW=1080;let mode='reel';
  const other={subject:'',shot:null,shotSrc:'',sel:0,scenes:[
    mk('5 sinais de que a sua marca precisa de ajuda.','marca','marble texture'),
    mk('Ninguém percebe o que vende em 5 segundos.','segundos','laptop desk minimal'),
    mk('Cada post parece de uma marca diferente.','diferente','design studio desk'),
    mk('Compete no preço, não no valor.','valor','african businesswoman'),
    mk('Guarde este post. Siga @novae.brandstudio.','Siga','gold details')]};
  function swap(){
    const sp=$$('#shotPrev'),cur={subject:$$('#subject').value,shot:S.shot,shotSrc:sp.style.display==='block'?sp.src:'',sel:S.sel,scenes:S.scenes};
    $$('#subject').value=other.subject;S.shot=other.shot;S.sel=other.sel;S.scenes=other.scenes;
    if(other.shotSrc){sp.src=other.shotSrc;sp.style.display='block'}else{sp.removeAttribute('src');sp.style.display='none'}
    $$('#shotBtn').textContent=other.shot?'Change screenshot':'Add screenshot';
    Object.assign(other,cur);
  }
  function setMode(m){
    if(m===mode)return;
    if(busy){toast('Wait for the export to finish.');return}
    if(playing)stop();
    swap();mode=m;const post=m==='post';
    tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.m===m));
    [1,4,5].forEach(i=>{if(secs[i])secs[i].style.display=post?'none':''});
    card.style.display=post?'':'none';
    $$('#mediaMode').style.display=post?'none':'';
    $$('#write').textContent=post?'Make my post':'Make my reel';
    $$('#subject').placeholder=post?'Type the post subject. Example: 5 erros que afastam clientes':'Type the subject or theme. Example: porque é que o seu negócio precisa de uma marca';
    renderScenes();drawStill();prev();
  }
  tabs.onclick=e=>{const b=e.target.closest('[data-m]');if(b)setMode(b.dataset.m)};
  const PRE='FORMAT FOR THIS REQUEST: an Instagram carousel POST, not a reel. Ignore the line count rule above. Write 5 to 7 slides. Slide 1 is a bold hook title. Each middle slide is one clear, practical insight, up to 14 words. The last slide tells the reader to save the post and follow @novae.brandstudio. Use the same JSON shape: each slide is one item in "lines".\nSUBJECT: ';
  document.addEventListener('click',async e=>{
    if(mode!=='post'||!e.target.closest('#write'))return;
    e.stopPropagation();e.preventDefault();
    const b=$$('#write');if(b.disabled)return;
    const text=$$('#subject').value.trim();
    if(!text&&!S.shot){toast('Type a subject or add a screenshot first.');return}
    b.disabled=true;b.textContent='Writing...';
    const keepCap=$$('#caption').value,keepQ=$$('#sndQ').value;let ok=false;
    try{ok=applyScript(await api('/api/script',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:PRE+(text||'(see the screenshot)'),image:S.shot})}))}
    catch(x){
      if(/no_ai_key/.test(x.message)){
        if(text){ok=applyScript(localScript(text));toast('No AI key yet, so I used your own text as the slides. Add the free Gemini key in Keys for AI writing.')}
        else toast('Reading a screenshot needs the free Gemini key. Add it in Keys.');
      }else toast(msg(x));
    }
    if(ok){$$('#postCap').value=$$('#caption').value===keepCap?'':$$('#caption').value}
    $$('#caption').value=keepCap;$$('#sndQ').value=keepQ;
    if(ok&&mode==='post'){
      b.textContent='Loading pictures...';const mm=$$('#mediaMode'),kv=mm.value;mm.value='photo';
      const p=autoMedia();mm.value=kv;await p;
    }
    b.disabled=false;b.textContent=mode==='post'?'Make my post':'Make my reel';prev();
  },true);
  function wrapP(c,words,maxW){
    const sp=c.measureText(' ').width,lines=[];let cur=[],cw=0;
    for(const w of words){const ww=c.measureText(w).width;
      if(cur.length&&cw+sp+ww>maxW){lines.push({words:cur,w:cw});cur=[];cw=0}
      cur.push({t:w,w:ww});cw+=(cur.length>1?sp:0)+ww}
    if(cur.length)lines.push({words:cur,w:cw});
    return {lines,sp};
  }
  function render(sc,idx,n,PH,num,cvs){
    cvs=cvs||document.createElement('canvas');if(cvs.width!==PW)cvs.width=PW;if(cvs.height!==PH)cvs.height=PH;
    const c=cvs.getContext('2d'),st=S.style;
    c.globalAlpha=1;c.globalCompositeOperation='source-over';c.shadowBlur=0;c.fillStyle='#000';c.fillRect(0,0,PW,PH);
    const m=sc.media;
    if(m){const el=m.el,iw=m.type==='video'?el.videoWidth:el.naturalWidth,ih=m.type==='video'?el.videoHeight:el.naturalHeight;
      if(iw&&ih){const s=Math.max(PW/iw,PH/ih)*1.02,dw=iw*s,dh=ih*s;try{c.drawImage(el,(PW-dw)/2,(PH-dh)/2,dw,dh)}catch(e){}}}
    else{const g0=c.createLinearGradient(0,0,0,PH);g0.addColorStop(0,'#1c1c1c');g0.addColorStop(1,'#000');c.fillStyle=g0;c.fillRect(0,0,PW,PH)}
    if(st.bw){c.globalCompositeOperation='saturation';c.fillStyle='#000';c.fillRect(0,0,PW,PH);c.globalCompositeOperation='source-over'}
    c.fillStyle='rgba(0,0,0,'+st.dim+')';c.fillRect(0,0,PW,PH);
    const g=c.createRadialGradient(PW/2,PH/2,PH*0.25,PW/2,PH/2,PH*0.8);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.78)');c.fillStyle=g;c.fillRect(0,0,PW,PH);
    c.textBaseline='middle';c.textAlign='left';
    const top=PH>=1900?236:120;
    if(st.brand&&st.brandText){
      const txt=st.brandText.toUpperCase();c.font='600 40px "Cinzel", serif';c.fillStyle='#fff';c.shadowColor='rgba(0,0,0,.8)';c.shadowBlur=12;
      const sp=18;let w=0;const ws=[];for(const ch of txt){const cw=c.measureText(ch).width;ws.push(cw);w+=cw+sp}w-=sp;
      let x=(PW-w)/2,k=0;for(const ch of txt){c.fillText(ch,x,top);x+=ws[k++]+sp}
      c.shadowBlur=0;c.fillStyle=st.accent;c.fillRect(PW/2-46,top+36,92,5);
    }
    let txt=String(sc.text||'').trim();
    if(txt){
      if(st.upper)txt=txt.toUpperCase();
      const words=txt.split(/\s+/),acc=norm(sc.accent),maxW=PW-170,wt=WEIGHT[st.font]||600;
      let size=Math.round(st.size*1.1),L;
      for(;;){c.font=wt+' '+size+'px "'+st.font+'", serif';L=wrapP(c,words,maxW);
        if((L.lines.length<=6&&!L.lines.some(l=>l.w>maxW))||size<=40)break;size-=4}
      const lh=size*1.3,bh=L.lines.length*lh;
      let y=st.pos==='top'?top+170:st.pos==='bottom'?PH-230-bh:(PH-bh)/2;
      c.shadowColor='rgba(0,0,0,.85)';c.shadowBlur=22;
      for(const line of L.lines){let x=(PW-line.w)/2;
        for(const w of line.words){c.fillStyle=(acc&&norm(w.t)===acc)?st.accent:'#fff';c.fillText(w.t,x,y+lh/2);x+=w.w+L.sp}
        y+=lh}
      c.shadowBlur=0;
    }
    if(num&&n>1){
      const by=PH-(PH>=1900?330:90);c.font='600 26px "Montserrat", sans-serif';c.fillStyle='rgba(255,255,255,.75)';
      const t=(idx+1)+' / '+n,tw=c.measureText(t).width;c.fillText(t,(PW-tw)/2,by);
    }
    return cvs;
  }
  function prev(){
    if(mode!=='post'||!S.scenes.length||document.hidden||!$$('#postPrev'))return; // auto.js replaces #postPrev; without it render() made a new canvas every 0.7 s
    const i=Math.min(S.sel,S.scenes.length-1);
    render(S.scenes[i],i,S.scenes.length,+$$('#postSize').value,$$('#postNum').checked,$$('#postPrev'));
  }
  setInterval(prev,700);
  $$('#postCopy').onclick=async()=>{const t=$$('#postCap');try{await navigator.clipboard.writeText(t.value);toast('Caption copied.')}catch(e){t.select();toast('Select and copy the text.')}};
  let urls=[],files=[];
  $$('#postGo').onclick=async()=>{
    const b=$$('#postGo'),out=$$('#postOut');
    b.disabled=true;b.textContent='Making...';
    try{
      await fontsReady();try{await document.fonts.load('600 26px "Montserrat"')}catch(e){}
      urls.forEach(u=>URL.revokeObjectURL(u));urls=[];files=[];
      const PH=+$$('#postSize').value,num=$$('#postNum').checked,n=S.scenes.length,stamp=Date.now();
      let html='<div class="pgrid">';
      for(let i=0;i<n;i++){
        const cvs=render(S.scenes[i],i,n,PH,num);
        const blob=await new Promise(r=>cvs.toBlob(r,'image/png'));
        if(!blob)throw new Error('post_render');
        const name='novae-post-'+stamp+'-'+(i+1)+'.png',url=URL.createObjectURL(blob);
        urls.push(url);try{files.push(new File([blob],name,{type:'image/png'}))}catch(e){}
        html+='<a download="'+name+'" href="'+url+'" aria-label="Download slide '+(i+1)+'"><img src="'+url+'" alt="Slide '+(i+1)+'" style="width:100%;border-radius:8px;border:1px solid var(--line);display:block"></a>';
      }
      html+='</div><p class="hint">Tap an image to download it.</p>';
      let canShare=false;try{canShare=files.length===n&&!!(navigator.canShare&&navigator.canShare({files}))}catch(e){}
      if(canShare)html+='<button id="postShare" class="mt">Share all images</button>';
      out.innerHTML=html;
      if(canShare)$$('#postShare').onclick=()=>navigator.share({files,title:'NOVAE post'}).catch(()=>{});
      toast(n>1?'Carousel ready: '+n+' images.':'Post image ready.');
    }catch(e){toast('Could not make the post images. Try again.')}
    b.disabled=false;b.textContent='Make post images';
  };
})();
