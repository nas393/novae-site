/* Scene editor: clear labels, crimson accent word, validation, live per-scene preview. */
(function(){
  const q=s=>document.querySelector(s),CR='#C9A24A',IV='#F3EAD6';
  const st=document.createElement('style');
  st.textContent='.sc2{display:block}.sct{display:flex;gap:10px;align-items:stretch;margin-bottom:4px}.sct .x{flex:0 0 42px;min-height:38px;padding:0;align-self:flex-start}'+
    '.pv{flex:1;min-width:0;background:#000;border:1px solid var(--line);border-radius:8px;padding:12px 10px;display:flex;align-items:center;justify-content:center;text-align:center;'+
    'font:500 18px/1.3 "EB Garamond",serif;color:'+IV+';overflow-wrap:break-word}.pv span{display:block;max-width:100%}.pv b{color:'+CR+';font-weight:500}.pv i{color:#777;font-size:14px}'+
    '.scg{display:grid;grid-template-columns:1fr 1fr;gap:10px}.scg label{min-height:2.6em;display:flex;align-items:flex-end}.sc2 input{padding:10px;font-size:16px}'+
    '.warn{color:#ff6b78;font-size:12.5px;margin:5px 0 0;min-height:0}.warn:empty{display:none}@media(max-width:340px){.scg{grid-template-columns:1fr}.scg label{min-height:0}}';
  document.head.appendChild(st);
  const isPost=()=>{const b=q('[data-m="post"]');return !!(b&&b.classList.contains('on'))};
  const words=t=>String(t||'').trim().split(/\s+/).filter(Boolean);
  const hit=(sc)=>{const a=norm(sc.accent);return !a||words(sc.text).some(w=>norm(w)===a)};
  const pvHtml=sc=>{const a=norm(sc.accent),w=words(sc.text);return w.length?w.map(x=>a&&norm(x)===a?'<b>'+esc(x)+'</b>':esc(x)).join(' '):'<i>No text yet</i>'};
  function refresh(i){
    const sc=S.scenes[i],box=q('.sc2[data-s="'+i+'"]');if(!sc||!box)return;
    box.querySelector('.pv').innerHTML='<span>'+pvHtml(sc)+'</span>';
    const a=String(sc.accent||'').trim();
    box.querySelector('.wa').textContent=!a?'':(/\s/.test(a)?'Use one word only.':(hit(sc)?'':'"'+a+'" is not in the scene text.'));
  }
  window.renderScenes=function(){
    const post=isPost();
    q('#scenes').innerHTML=S.scenes.map((sc,i)=>'<div class="scene sc2" data-s="'+i+'">'+
      '<div class="sct"><button class="thumb" data-i="'+i+'" aria-label="Change picture"></button><div class="pv" aria-label="Scene preview"></div><button class="x" data-del="'+i+'" aria-label="Delete scene">X</button></div>'+
      '<label for="st'+i+'">'+(post?'Slide text':'Scene text')+'</label><textarea id="st'+i+'" rows="2" data-i="'+i+'" data-k="text">'+esc(sc.text)+'</textarea>'+
      '<div class="scg"><div><label for="sa'+i+'">Red accent word</label><input id="sa'+i+'" type="text" autocapitalize="off" autocomplete="off" data-i="'+i+'" data-k="accent" value="'+esc(sc.accent)+'"><p class="warn wa" role="alert"></p></div>'+
      (post?'<div><label for="sb'+i+'">Category label</label><input id="sb'+i+'" type="text" data-i="'+i+'" data-k="sub" value="'+esc(sc.sub||'')+'"></div>'
           :'<div><label for="sd'+i+'">Scene duration (seconds)</label><input id="sd'+i+'" type="text" inputmode="decimal" data-i="'+i+'" data-k="durx" value="'+sc.dur+'"><p class="warn wd" role="alert"></p></div>')+
      '</div></div>').join('');
    S.scenes.forEach(paintThumb);S.scenes.forEach((_,i)=>refresh(i));
  };
  q('#scenes').addEventListener('input',e=>{
    const el=e.target,i=+el.dataset.i,k=el.dataset.k;if(!k||!S.scenes[i])return;
    if(k==='durx'){
      const raw=String(el.value).trim().replace(',','.'),v=Number(raw),ok=raw!==''&&isFinite(v)&&v>=1&&v<=10;
      if(ok){S.scenes[i].dur=Math.round(v*10)/10;drawStill()}
      const w=el.parentElement.querySelector('.wd');if(w)w.textContent=ok?'':'Use a number from 1 to 10. Example: 3.5';
    }
    refresh(i);
  });
  /* crimson accent word in reels */
  const H=s=>'500 '+s+'px "EB Garamond", serif',sent=t=>{t=String(t||'').trim();return t?t.charAt(0).toUpperCase()+t.slice(1):t};
  window.drawText=function(sc,lt,a){
    const txt=sent(sc.text);if(!txt||a<=0)return;
    const acc=norm(sc.accent),maxW=W-190,ws=txt.split(/\s+/);let size=S.style.size,rows,spw;
    for(;;){ctx.font=H(size);spw=ctx.measureText(' ').width;rows=[];let cur=[],cw=0;
      for(const w of ws){const ww=ctx.measureText(w).width;if(cur.length&&cw+spw+ww>maxW){rows.push({ws:cur,w:cw});cur=[];cw=0}cur.push({t:w,w:ww,hit:!!acc&&norm(w)===acc});cw+=(cur.length>1?spw:0)+ww}
      if(cur.length)rows.push({ws:cur,w:cw});
      if((rows.length<=6&&!rows.some(r=>r.w>maxW))||size<=40)break;size-=4}
    const lh=size*1.28,step=Math.min(0.26,(sc.dur*0.55)/Math.max(ws.length,1));let y=(1920-rows.length*lh)/2,k=0;
    ctx.textBaseline='middle';ctx.textAlign='left';ctx.shadowColor='rgba(0,0,0,.85)';ctx.shadowBlur=22;ctx.font=H(size);
    for(const r of rows){let x=(W-r.w)/2;for(const w of r.ws){const al=Math.min(1,Math.max(0,(lt-0.15-k*step)/0.22));
        if(al>0){ctx.globalAlpha=al*a;ctx.fillStyle=w.hit?CR:IV;ctx.fillText(w.t,x,y+lh/2+(1-al)*26)}x+=w.w+spw;k++}y+=lh}
    ctx.globalAlpha=1;ctx.shadowBlur=0;
  };
  /* crimson accent word in posts and covers */
  if(window.LT){
    let acc='';const oldStill=LT.still;
    LT.still=function(sc,PH,idx,n,cvs){acc=norm(sc.accent);try{return oldStill(sc,PH,idx,n,cvs)}finally{acc=''}};
    LT.headline=function(c,title,x,y,maxW,size){
      const wrap=t=>{const o=[];let cur='';for(const w of t.split(/\s+/).filter(Boolean)){const n=cur?cur+' '+w:w;if(cur&&c.measureText(n).width>maxW){o.push(cur);cur=w}else cur=n}if(cur)o.push(cur);return o};
      let ls;for(;;){c.font=H(size);ls=wrap(sent(title));if(ls.length<=5||size<=44)break;size-=4}
      c.textBaseline='middle';c.textAlign='left';c.shadowColor='rgba(0,0,0,.85)';c.shadowBlur=16;
      for(const t of ls){let xx=x;for(const w of t.split(' ')){c.fillStyle=(acc&&norm(w)===acc)?CR:IV;c.fillText(w,xx,y+size*0.6);xx+=c.measureText(w+' ').width}y+=size*1.2}
      c.shadowBlur=0;y+=size*0.42;c.fillStyle=CR;c.fillRect(x,y,Math.round(size*0.95),6);return y+26;
    };
  }
  renderScenes();drawStill();
})();
