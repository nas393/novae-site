/* NOVAE brand identity (Obsidian, Ivory, Burgundy, EB Garamond, Inter) + My images library. */
(function(){
  const q=s=>document.querySelector(s),OBS='#121214',IV='#F3EAD6',BURG='#C9A24A',PW=1080;
  const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap';document.head.appendChild(l);
  const rs=document.documentElement.style;rs.setProperty('--red','#C9A24A');rs.setProperty('--ink',IV);rs.setProperty('--bg','#121214');rs.setProperty('--gold','#C9A24A');
  const H=(s,it)=>(it?'italic ':'')+'500 '+s+'px "EB Garamond", serif',U=s=>'600 '+s+'px "Inter", sans-serif';
  const sent=t=>{t=String(t||'').trim();return t?t.charAt(0).toUpperCase()+t.slice(1):t};
  function sp(c,t,x,y,g){for(const ch of t){c.fillText(ch,x,y);x+=c.measureText(ch).width+g}}
  function spW(c,t,g){let w=0;for(const ch of t)w+=c.measureText(ch).width+g;return w-g}
  function wrap(c,text,maxW,g){const o=[];let cur='';for(const w of String(text||'').split(/\s+/).filter(Boolean)){const t=cur?cur+' '+w:w;if(cur&&(g?spW(c,t,g):c.measureText(t).width)>maxW){o.push(cur);cur=w}else cur=t}if(cur)o.push(cur);return o}
  const LT=window.LT={
    fx(c,w,h){c.save();c.globalAlpha=1;c.shadowBlur=0;c.globalCompositeOperation='overlay';
      let g=c.createLinearGradient(w,0,w*0.4,h*0.55);g.addColorStop(0,'rgba(201,162,74,.6)');g.addColorStop(1,'rgba(201,162,74,0)');c.fillStyle=g;c.fillRect(0,0,w,h);
      c.globalCompositeOperation='screen';g=c.createRadialGradient(w*0.9,h*0.2,0,w*0.9,h*0.2,h*0.45);g.addColorStop(0,'rgba(201,162,74,.22)');g.addColorStop(1,'rgba(201,162,74,0)');c.fillStyle=g;c.fillRect(0,0,w,h);c.restore()},
    brand(c,w,y,size){c.textBaseline='middle';c.textAlign='left';c.font=H(size);c.fillStyle=IV;const g=size*0.55,bw=spW(c,'NOVAE',g);sp(c,'NOVAE',(w-bw)/2,y,g);c.fillStyle=BURG;c.fillRect(w/2-44,y+size*1.05,88,5)},
    headline(c,title,x,y,maxW,size){let ls;for(;;){c.font=H(size);ls=wrap(c,sent(title),maxW);if(ls.length<=5||size<=44)break;size-=4}
      c.fillStyle=IV;c.shadowColor='rgba(0,0,0,.85)';c.shadowBlur=16;for(const t of ls){c.fillText(t,x,y+size*0.6);y+=size*1.2}
      c.shadowBlur=0;y+=size*0.42;c.fillStyle=BURG;c.fillRect(x,y,Math.round(size*0.95),6);return y+26},
    still(sc,PH,idx,n,cvs){
      cvs=cvs||document.createElement('canvas');if(cvs.width!==PW)cvs.width=PW;if(cvs.height!==PH)cvs.height=PH;
      const c=cvs.getContext('2d');c.globalAlpha=1;c.globalCompositeOperation='source-over';c.shadowBlur=0;c.fillStyle=OBS;c.fillRect(0,0,PW,PH);
      const m=sc.media;
      if(m){const el=m.el,iw=m.type==='video'?el.videoWidth:el.naturalWidth,ih=m.type==='video'?el.videoHeight:el.naturalHeight;
        if(iw&&ih){const s=Math.max(PW/iw,PH/ih)*1.12,dw=iw*s,dh=ih*s;try{c.drawImage(el,(PW-dw)/2+PW*0.18,(PH-dh)/2,dw,dh)}catch(e){}}}
      c.globalCompositeOperation='saturation';c.fillStyle='#000';c.fillRect(0,0,PW,PH);c.globalCompositeOperation='source-over';
      c.fillStyle='rgba(18,18,20,.28)';c.fillRect(0,0,PW,PH);
      let g=c.createLinearGradient(0,0,PW*0.8,0);g.addColorStop(0,'rgba(18,18,20,1)');g.addColorStop(0.3,'rgba(18,18,20,.94)');g.addColorStop(1,'rgba(18,18,20,0)');c.fillStyle=g;c.fillRect(0,0,PW,PH);
      LT.fx(c,PW,PH);
      const safe=PH>=1900?180:0;
      c.strokeStyle='rgba(243,234,214,.45)';c.lineWidth=2;c.strokeRect(34,34+safe,PW-68,PH-68-2*safe);
      c.textBaseline='middle';c.textAlign='left';c.fillStyle=IV;
      c.font=H(26);sp(c,'NOVAE',88,104+safe,10);
      if(n>1){c.font='400 38px "EB Garamond", serif';const t=String(idx+1).padStart(2,'0');c.fillText(t,PW-88-c.measureText(t).width,104+safe)}
      let size=78,ls;const X=88,maxW=PW*0.56;
      for(;;){c.font=H(size);ls=wrap(c,sent(sc.text),maxW);if(ls.length<=5||size<=48)break;size-=4}
      c.font=U(22);const lab=sc.sub?wrap(c,String(sc.sub).toUpperCase(),maxW,7).slice(0,2):[];
      const bh=ls.length*size*1.2+size*0.42+6+(lab.length?64+lab.length*38:0);
      LT.headline(c,sc.text,X,PH*0.52-bh/2,maxW,size);
      if(lab.length){let y=PH*0.52-bh/2+ls.length*size*1.2+size*0.42+6+64;c.font=U(22);c.fillStyle='rgba(243,234,214,.88)';for(const t of lab){sp(c,t,X+2,y,7);y+=38}}
      return cvs;
    }
  };
  /* ---- reel look ---- */
  Object.assign(S.style,{font:'EB Garamond',pos:'center',accent:IV,size:78,dim:0.4,bw:true,upper:false,brand:true,brandText:'NOVAE'});
  WEIGHT['EB Garamond']=500;
  window.fontsReady=async function(){try{await Promise.all([document.fonts.load(H(60)),document.fonts.load(H(60,1)),document.fonts.load(U(22)),document.fonts.load('400 38px "EB Garamond"')])}catch(e){}};
  window.drawBrand=function(){LT.fx(ctx,W,H0);LT.brand(ctx,W,236,40)};
  const H0=1920;
  window.drawText=function(sc,lt,a){
    const txt=sent(sc.text);if(!txt||a<=0)return;
    const acc=norm(sc.accent),maxW=W-190;let size=S.style.size,rows,spw;
    const build=()=>{ctx.font=H(size);spw=ctx.measureText(' ').width;rows=[];let cur=[],cw=0;
      for(const w of txt.split(/\s+/)){const it=!!acc&&norm(w)===acc;ctx.font=H(size,it);const ww=ctx.measureText(w).width;
        if(cur.length&&cw+spw+ww>maxW){rows.push({ws:cur,w:cw});cur=[];cw=0}cur.push({t:w,w:ww,it});cw+=(cur.length>1?spw:0)+ww}
      if(cur.length)rows.push({ws:cur,w:cw})};
    for(;;){build();if((rows.length<=6&&!rows.some(r=>r.w>maxW))||size<=40)break;size-=4}
    const lh=size*1.28,n=txt.split(/\s+/).length,step=Math.min(0.26,(sc.dur*0.55)/Math.max(n,1));
    let y=(H0-rows.length*lh)/2,k=0;
    ctx.textBaseline='middle';ctx.textAlign='left';ctx.shadowColor='rgba(0,0,0,.85)';ctx.shadowBlur=22;ctx.fillStyle=IV;
    for(const r of rows){let x=(W-r.w)/2;for(const w of r.ws){const al=Math.min(1,Math.max(0,(lt-0.15-k*step)/0.22));
        if(al>0){ctx.globalAlpha=al*a;ctx.font=H(size,w.it);ctx.fillText(w.t,x,y+lh/2+(1-al)*26)}x+=w.w+spw;k++}y+=lh}
    ctx.globalAlpha=1;ctx.shadowBlur=0;
  };
  /* ---- My images library (kept in this browser) ---- */
  let db=null,lib=[];
  const open=()=>new Promise((res,rej)=>{try{const r=indexedDB.open('novae_lib',1);r.onupgradeneeded=()=>r.result.createObjectStore('imgs',{keyPath:'id',autoIncrement:true});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}});
  const tx=(mode,fn)=>new Promise((res,rej)=>{const t=db.transaction('imgs',mode),rq=fn(t.objectStore('imgs'));t.oncomplete=()=>res(rq&&rq.result);t.onerror=()=>rej(t.error)});
  const useLib=()=>{try{return localStorage.getItem('lrm_uselib')!=='0'}catch(e){return true}};
  const shrink=f=>new Promise(res=>{const im=new Image(),u=URL.createObjectURL(f);im.onload=()=>{const s=Math.min(1,1800/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*s);c.height=Math.round(im.naturalHeight*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>res(b),'image/jpeg',0.9)};im.onerror=()=>res(null);im.src=u});
  const card=document.createElement('section');card.className='card';
  card.innerHTML='<h2><b>MY</b>IMAGES</h2><label class="check"><input id="lbUse" type="checkbox">Use my images first</label>'+
    '<button id="lbAdd" class="ghost" style="width:100%">Upload my images</button><input id="lbFile" type="file" accept="image/*" multiple hidden>'+
    '<div class="pgrid" id="lbGrid"></div><p class="hint" id="lbHint"></p>';
  const anchor=q('#wkGo')?q('#wkGo').closest('section'):(q('#apGo')?q('#apGo').closest('section'):null);
  if(anchor)anchor.after(card);else q('main').appendChild(card);
  function paint(){q('#lbGrid').innerHTML=lib.map(x=>'<button data-id="'+x.id+'" aria-label="Remove image" style="background-image:url(&quot;'+x.url+'&quot;);filter:none;aspect-ratio:4/5"></button>').join('');
    q('#lbHint').textContent=lib.length?lib.length+' image(s) saved on this phone. Tap one twice to remove it. Posts, covers, PDFs and reel photos use these first.':'Upload your own images (for example from ChatGPT). They stay on this phone. With no images, the tool uses free stock photos.'}
  async function load(){try{db=await open();const rows=await tx('readonly',s=>s.getAll());lib=(rows||[]).map(r=>({id:r.id,url:URL.createObjectURL(r.blob)}))}catch(e){lib=[]}paint()}
  q('#lbUse').checked=useLib();q('#lbUse').onchange=e=>{try{localStorage.setItem('lrm_uselib',e.target.checked?'1':'0')}catch(x){}};
  q('#lbAdd').onclick=()=>q('#lbFile').click();
  q('#lbFile').onchange=async e=>{const fs=[...e.target.files];e.target.value='';if(!fs.length)return;if(!db){toast('This browser cannot save images.');return}
    let ok=0;for(const f of fs){const b=await shrink(f);if(!b)continue;try{const id=await tx('readwrite',s=>s.add({blob:b}));lib.push({id,url:URL.createObjectURL(b)});ok++}catch(x){}}
    paint();toast(ok+' image(s) added.')};
  let arm=0;q('#lbGrid').onclick=async e=>{const b=e.target.closest('[data-id]');if(!b)return;const id=+b.dataset.id;
    if(arm!==id){arm=id;b.style.outline='3px solid #C9A24A';toast('Tap again to remove this image.');return}
    arm=0;try{await tx('readwrite',s=>s.delete(id))}catch(x){}lib=lib.filter(x=>x.id!==id);paint()};
  const stock=fetchItems;
  window.fetchItems=async function(type,query){
    if(type==='photo'&&useLib()&&lib.length){const a=lib.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
      return a.map(x=>({id:'lib'+x.id,type:'photo',thumb:x.url,src:x.url,local:true,credit:'mine'}))}
    return stock(type,query)};
  load();
  const sm=q('.logo small');if(sm)sm.textContent='BRAND STUDIO · LUANDA';
  fontsReady().then(()=>drawStill());
})();
