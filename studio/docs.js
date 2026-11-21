/* Flyer, free guide PDF, ebook PDF and week plan. All text by AI. NOVAE theme. */
(function(){
  const q=s=>document.querySelector(s),RED='#C9A24A',DW=1240,DH=1754,M=120,INK='#F3EAD6';
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const ask=text=>api('/api/script',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text})});
  const DUMMY='Do not write a reel. Return the usual JSON where "lines" has exactly 1 item {"text":"ok","accent":"","visual":""}, plus one extra key "doc". Follow the NOVAE voice rules above: clear, warm, expert, simple words, no emojis. ';
  const P={
    flyer:'FLYER REQUEST. '+DUMMY+'"doc" = {"title": a headline of 3 to 6 words in sentence case, "sub": one line of 5 to 9 words, "points": exactly 3 insights or steps of 4 to 8 words each, "cta": 3 to 5 words, "visual": a 2-3 word stock photo search (statue, marble bust, lion, chess, hourglass, helmet)}.\nSUBJECT: ',
    guide:'GUIDE REQUEST. '+DUMMY+'"doc" = {"title": 3 to 6 words in sentence case, "sub": 6 to 10 words, "visual": a 2-3 word stock photo search (statue, marble bust, lion, chess), "intro": 60 to 80 words, "sections": exactly 5 items {"heading": 2 to 5 words, "body": 90 to 120 words, "quote": one sharp insight of 6 to 12 words, "steps": exactly 3 actions of 4 to 9 words each}, "outro": 40 to 60 words}.\nSUBJECT: ',
    ebook:'EBOOK OUTLINE REQUEST. '+DUMMY+'"doc" = {"title": 3 to 6 words in sentence case, "sub": 6 to 10 words, "visual": a 2-3 word stock photo search, "intro": 80 to 110 words, "chapters": exactly 8 items {"heading": 2 to 5 words, "visual": a 2-3 word stock photo search (statue, marble bust, lion, chess, hourglass, storm, mountain, chains, helmet, columns)}, "outro": 50 to 70 words}.\nSUBJECT: ',
    chapter:'EBOOK CHAPTER REQUEST. '+DUMMY+'"doc" = {"body": 230 to 280 words in 3 paragraphs separated by a blank line, "quote": one sharp insight of 6 to 12 words, "steps": exactly 3 actions of 4 to 9 words each}.\n',
    week:'WEEK PLAN REQUEST. Do not write a reel. Return the usual JSON where "lines" has exactly 7 items, one per day from Monday to Sunday. Each "text" is one subject of 4 to 9 words. Use 7 different angles: positioning, identity, content, website, campaigns, sales, a client story. Set "accent" and "visual" to "".\nFOCUS: '
  };
  /* ---- drawing helpers ---- */
  const F={h:s=>'500 '+s+'px "EB Garamond", serif',b:s=>'400 '+Math.round(s*0.82)+'px "Inter", sans-serif',i:s=>'italic 500 '+s+'px "EB Garamond", serif',s:s=>'600 '+s+'px "Inter", sans-serif'};
  function sp(c,t,x,y,g){for(const ch of t){c.fillText(ch,x,y);x+=c.measureText(ch).width+g}}
  function spW(c,t,g){let w=0;for(const ch of t)w+=c.measureText(ch).width+g;return w-g}
  function wrap(c,text,maxW,g){const out=[];let cur='';for(const w of String(text||'').split(/\s+/).filter(Boolean)){const t=cur?cur+' '+w:w;if(cur&&(g?spW(c,t,g):c.measureText(t).width)>maxW){out.push(cur);cur=w}else cur=t}if(cur)out.push(cur);return out}
  function redFx(c,w,h){window.LT.fx(c,w,h)}
  function photoBg(c,w,h,img){
    c.fillStyle='#000';c.fillRect(0,0,w,h);
    if(img&&img.naturalWidth){const s=Math.max(w/img.naturalWidth,h/img.naturalHeight)*1.22,dw=img.naturalWidth*s,dh=img.naturalHeight*s;try{c.drawImage(img,0,(h-dh)/2,dw,dh)}catch(e){}}
    c.globalCompositeOperation='saturation';c.fillStyle='#000';c.fillRect(0,0,w,h);c.globalCompositeOperation='source-over';
    c.fillStyle='rgba(0,0,0,.3)';c.fillRect(0,0,w,h);
    let g=c.createLinearGradient(0,0,w*0.8,0);g.addColorStop(0,'rgba(0,0,0,.92)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,w,h);
    g=c.createLinearGradient(0,h*0.55,0,h);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.85)');c.fillStyle=g;c.fillRect(0,0,w,h);
    redFx(c,w,h);
  }
  function brand(c,w,y,size){window.LT.brand(c,w,y,size)}
  /* headline block: last word big and red. returns bottom y */
  function headline(c,title,x,y,maxW,size,fullW){return window.LT.headline(c,title,x,y,maxW,size,fullW)}
  function mkCanvas(w,h){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const c=cv.getContext('2d');c.textBaseline='middle';c.textAlign='left';return {cv,c}}
  async function loadPhoto(query){
    try{const items=await fetchItems('photo',query||'marble statue');if(!items.length)return null;
      const it=items[Math.floor(Math.random()*Math.min(items.length,6))],r=await fetch(it.local?it.src:'/api/proxy?u='+encodeURIComponent(it.src));if(!r.ok)return null;
      const im=new Image(),u=URL.createObjectURL(await r.blob());await new Promise((res,rej)=>{im.onload=res;im.onerror=rej;im.src=u});return im}
    catch(e){return null}
  }
  /* ---- pages ---- */
  function coverPage(doc,img,tag){
    const {cv,c}=mkCanvas(DW,DH);photoBg(c,DW,DH,img);brand(c,DW,130,36);
    let y=headline(c,doc.title,M,DH*0.40,DW*0.6,104,DW-2*M);
    c.font=F.s(26);c.fillStyle='rgba(255,255,255,.9)';y+=50;for(const l of wrap(c,String(doc.sub||'').toUpperCase(),DW*0.58,7).slice(0,3)){sp(c,l,M+2,y,7);y+=46}
    c.font=F.s(22);c.fillStyle=RED;sp(c,tag,M+2,DH-150,8);c.fillStyle='rgba(255,255,255,.7)';sp(c,'@NOVAE.BRANDSTUDIO',M+2,DH-106,8);
    return cv;
  }
  function chapterPage(n,heading,img){
    const {cv,c}=mkCanvas(DW,DH);photoBg(c,DW,DH,img);brand(c,DW,130,30);
    c.font=F.s(26);c.fillStyle=RED;sp(c,'CHAPTER '+String(n).padStart(2,'0'),M+2,DH*0.46,10);
    headline(c,heading,M,DH*0.46+50,DW*0.62,92,DW-2*M);return cv;
  }
  function endPage(){
    const {cv,c}=mkCanvas(DW,DH);c.fillStyle='#0a0a0a';c.fillRect(0,0,DW,DH);redFx(c,DW,DH);brand(c,DW,DH*0.36,44);
    c.font=F.h(60);c.fillStyle='#fff';const t=((()=>{try{return localStorage.getItem('novae_lang')}catch(e){}})()==='en'?'Few brands are chosen.':'Poucas marcas são escolhidas.');c.fillText(t,(DW-c.measureText(t).width)/2,DH*0.5);
    c.font=F.s(26);c.fillStyle=RED;const f='FOLLOW @NOVAE.BRANDSTUDIO';sp(c,f,(DW-spW(c,f,9))/2,DH*0.5+110,9);return cv;
  }
  /* text flow over as many pages as needed */
  function flow(){
    const pages=[];let c=null,y=0;const bottom=DH-190,TW=DW-2*M;
    const add=()=>{const o=mkCanvas(DW,DH);c=o.c;c.fillStyle='#121214';c.fillRect(0,0,DW,DH);c.fillStyle=RED;c.fillRect(M,150,60,4);
      c.font=F.h(24);c.fillStyle='rgba(255,255,255,.75)';sp(c,'NOVAE',M,104,14);pages.push(o.cv);y=230};
    const need=h=>{if(!c||y+h>bottom)add()};
    return {pages,
      label(t){need(200);c.font=F.s(24);c.fillStyle=RED;sp(c,String(t).toUpperCase(),M,y,9);y+=58},
      head(t){c||add();c.font=F.h(62);const ls=wrap(c,String(t),TW);need(ls.length*76+80);c.font=F.h(62);c.fillStyle='#fff';for(const l of ls){c.fillText(l,M,y+30);y+=76}y+=34},
      para(t){for(const p of String(t||'').split(/\n\s*\n|\n/).map(s=>s.trim()).filter(Boolean)){c||add();c.font=F.b(40);const ls=wrap(c,p,TW);
        for(const l of ls){need(58);c.font=F.b(40);c.fillStyle=INK;c.fillText(l,M,y+20);y+=58}y+=30}},
      quote(t){if(!t)return;c||add();c.font=F.i(48);const ls=wrap(c,String(t),TW-70);const h=ls.length*66+40;need(h+50);y+=14;c.fillStyle=RED;c.fillRect(M,y,6,h-20);
        c.font=F.i(48);c.fillStyle='#fff';let yy=y+26;for(const l of ls){c.fillText(l,M+46,yy);yy+=66}y+=h+40},
      steps(list,title){list=(list||[]).filter(Boolean).slice(0,12);if(!list.length)return;need(110+Math.min(list.length,3)*70);c.font=F.s(24);c.fillStyle=RED;sp(c,title||'DO THIS',M,y,9);y+=64;
        list.forEach((s,i)=>{c.font=F.b(40);const ls=wrap(c,String(s),TW-90);need(ls.length*56+20);c.font=F.h(34);c.fillStyle=RED;c.fillText(String(i+1).padStart(2,'0'),M,y+20);
          c.font=F.b(40);c.fillStyle=INK;for(const l of ls){c.fillText(l,M+90,y+20);y+=56}y+=16});y+=20},
      gap(n){y+=n},brk(){c=null}};
  }
  function numberPages(list,from){list.forEach((cv,i)=>{const c=cv.getContext('2d');c.textBaseline='middle';c.font=F.s(22);c.fillStyle='rgba(255,255,255,.55)';const t=String(from+i);c.fillText(t,(DW-c.measureText(t).width)/2,DH-100)})}
  function flyerImg(doc,img){
    const w=1080,h=1350,{cv,c}=mkCanvas(w,h);photoBg(c,w,h,img);brand(c,w,104,32);
    let y=headline(c,doc.title,90,h*0.22,w*0.64,84,w-180);
    c.font=F.s(23);c.fillStyle='rgba(255,255,255,.9)';y+=42;for(const l of wrap(c,String(doc.sub||'').toUpperCase(),w*0.6,6).slice(0,2)){sp(c,l,92,y,6);y+=40}
    y+=46;c.shadowColor='rgba(0,0,0,.85)';c.shadowBlur=12;
    (doc.points||[]).slice(0,4).forEach(p=>{c.font=F.b(44);const ls=wrap(c,String(p),w*0.66);c.fillStyle=RED;c.fillRect(92,y+8,16,16);c.fillStyle='#fff';for(const l of ls){c.fillText(l,134,y+18);y+=54}y+=22});
    c.shadowBlur=0;c.fillStyle=RED;c.fillRect(0,h-150,w,96);c.font=F.s(30);c.fillStyle='#fff';const t=String(doc.cta||'Follow @novae.brandstudio').toUpperCase();const tw=spW(c,t,8);sp(c,t,(w-tw)/2,h-102,8);
    c.font=F.s(20);c.fillStyle='rgba(255,255,255,.7)';const a='@NOVAE.BRANDSTUDIO';sp(c,a,(w-spW(c,a,8))/2,h-28,8);
    return cv;
  }
  /* ---- tiny PDF writer: one JPEG per page ---- */
  const jpg=cv=>new Promise(r=>cv.toBlob(async b=>r({u8:new Uint8Array(await b.arrayBuffer()),w:cv.width,h:cv.height}),'image/jpeg',0.88));
  function pdf(pages,pw,ph){
    const enc=new TextEncoder(),parts=[],offs=[];let len=0;
    const push=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);len+=b.length};
    const obj=(n,fn)=>{offs[n]=len;push(n+' 0 obj\n');fn();push('\nendobj\n')};
    push('%PDF-1.4\n');const n=pages.length;
    obj(1,()=>push('<< /Type /Catalog /Pages 2 0 R >>'));
    obj(2,()=>push('<< /Type /Pages /Count '+n+' /Kids ['+pages.map((_,i)=>(3+3*i)+' 0 R').join(' ')+'] >>'));
    pages.forEach((p,i)=>{const a=3+3*i,cs='q '+pw+' 0 0 '+ph+' 0 0 cm /Im0 Do Q';
      obj(a,()=>push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+pw+' '+ph+'] /Resources << /XObject << /Im0 '+(a+2)+' 0 R >> >> /Contents '+(a+1)+' 0 R >>'));
      obj(a+1,()=>push('<< /Length '+cs.length+' >>\nstream\n'+cs+'\nendstream'));
      obj(a+2,()=>{push('<< /Type /XObject /Subtype /Image /Width '+p.w+' /Height '+p.h+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+p.u8.length+' >>\nstream\n');push(p.u8);push('\nendstream')})});
    const total=2+3*n,xref=len;let x='xref\n0 '+(total+1)+'\n0000000000 65535 f \n';
    for(let k=1;k<=total;k++)x+=String(offs[k]).padStart(10,'0')+' 00000 n \n';
    push(x+'trailer\n<< /Size '+(total+1)+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF');
    return new Blob(parts,{type:'application/pdf'});
  }
  async function toPdf(cvs,pw,ph){const pages=[];for(const cv of cvs)pages.push(await jpg(cv));return pdf(pages,pw,ph)}
  /* ---- UI ---- */
  const host=q('#apGo')?q('#apGo').closest('section'):q('main').firstElementChild;
  const card=document.createElement('section');card.className='card';
  card.innerHTML='<h2><b>PDF</b>BOOK / GUIDE / FLYER</h2>'+
    '<select id="dcType"><option value="flyer">Flyer (1 page)</option><option value="guide">Free guide PDF (about 10 pages)</option><option value="ebook">Ebook PDF (8 chapters, 25+ pages)</option></select>'+
    '<input id="dcSub" class="mt" type="text" placeholder="Write one subject. Example: como posicionar a sua marca em Luanda" style="margin-top:10px">'+
    '<button id="dcGo" class="primary mt">Make it</button><p class="hint" id="dcStat">AI writes all the text. Same NOVAE look.</p><div id="dcOut"></div>';
  host.after(card);
  const wk=document.createElement('section');wk.className='card';
  wk.innerHTML='<h2><b>7D</b>WEEK PLAN</h2><button id="wkGo" class="ghost" style="width:100%">Plan my week</button><div id="wkList"></div><p class="hint">7 subjects, one per day. Tap Make to run the autopilot for that day.</p>';
  card.after(wk);
  const stat=t=>{q('#dcStat').textContent=t};
  const fonts=async()=>{try{await Promise.all([document.fonts.load(F.h(60)),document.fonts.load(F.b(40)),document.fonts.load(F.i(48)),document.fonts.load(F.s(24))])}catch(e){}};
  function show(blob,name,first,extra){
    const url=URL.createObjectURL(blob),p=first.toDataURL('image/jpeg',0.8);
    q('#dcOut').innerHTML='<img src="'+p+'" alt="First page" style="width:100%;max-width:290px;display:block;margin:12px auto;border-radius:10px;border:1px solid var(--line)">'+
      '<div class="row"><a class="btn primary" download="'+name+'" href="'+url+'">Download PDF</a></div>'+(extra||'');
    let file=null,ok=false;try{file=new File([blob],name,{type:'application/pdf'});ok=!!(navigator.canShare&&navigator.canShare({files:[file]}))}catch(e){}
    if(ok){const b=document.createElement('button');b.className='mt';b.textContent='Share PDF';b.onclick=()=>navigator.share({files:[file],title:'NOVAE'}).catch(()=>{});q('#dcOut').appendChild(b)}
  }
  const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40)||'novae';
  async function retry(fn){try{return await fn()}catch(e){if(/key/.test(e.message))throw e;await wait(9000);return await fn()}}
  let busyDoc=false;
  q('#dcGo').onclick=async()=>{
    if(busyDoc)return;const sub=q('#dcSub').value.trim(),type=q('#dcType').value;if(!sub){toast('Write one subject first.');return}
    busyDoc=true;const b=q('#dcGo');b.disabled=true;q('#dcOut').innerHTML='';
    try{
      await fonts();
      if(type==='flyer'){
        stat('Writing the flyer...');const d=(await ask(P.flyer+sub)).doc||{};if(!d.title)throw new Error('ai_empty');
        stat('Finding a picture...');const cv=flyerImg(d,await loadPhoto(d.visual));
        const png=await new Promise(r=>cv.toBlob(r,'image/png')),pu=URL.createObjectURL(png),nm='novae-flyer-'+slug(d.title);
        show(await toPdf([cv],540,675),nm+'.pdf',cv,'<div class="row mt"><a class="btn" download="'+nm+'.png" href="'+pu+'">Download image (PNG)</a></div>');
      }else if(type==='guide'){
        stat('Writing the guide...');const d=(await ask(P.guide+sub)).doc||{};if(!d.title||!Array.isArray(d.sections))throw new Error('ai_empty');
        stat('Finding a picture...');const img=await loadPhoto(d.visual);
        stat('Building the pages...');const fl=flow();fl.label('Start here');fl.head('Read this first');fl.para(d.intro);
        d.sections.forEach((s,i)=>{fl.brk();fl.label('Part '+String(i+1).padStart(2,'0'));fl.head(s.heading);fl.para(s.body);fl.quote(s.quote);fl.steps(s.steps)});
        fl.brk();fl.label('Last word');fl.head('Now act');fl.para(d.outro);
        numberPages(fl.pages,2);const all=[coverPage(d,img,'A FREE NOVAE GUIDE'),...fl.pages,endPage()];
        show(await toPdf(all,595,842),'novae-guide-'+slug(d.title)+'.pdf',all[0]);
      }else{
        stat('Planning the ebook...');const d=(await ask(P.ebook+sub)).doc||{};if(!d.title||!Array.isArray(d.chapters))throw new Error('ai_empty');
        const chs=d.chapters.slice(0,10),n=chs.length;const img=await loadPhoto(d.visual);
        const intro=flow();intro.label('Contents');intro.head('Inside this book');intro.steps(chs.map(c=>c.heading),'CHAPTERS');intro.brk();intro.label('Start here');intro.head('Read this first');intro.para(d.intro);
        let all=[coverPage(d,img,'A NOVAE BOOK'),...intro.pages],skipped=0;
        for(let i=0;i<n;i++){
          stat('Writing chapter '+(i+1)+' of '+n+'...');
          let c=null;try{c=(await retry(()=>ask(P.chapter+'BOOK: "'+d.title+'". SUBJECT: '+sub+'. CHAPTER '+(i+1)+' of '+n+': "'+chs[i].heading+'".'))).doc}catch(e){if(/key/.test(e.message))throw e}
          const ph=await loadPhoto(chs[i].visual);all.push(chapterPage(i+1,chs[i].heading,ph));
          if(c&&c.body){const fl=flow();fl.label('Chapter '+String(i+1).padStart(2,'0'));fl.head(chs[i].heading);fl.para(c.body);fl.quote(c.quote);fl.steps(c.steps);all.push(...fl.pages)}else skipped++;
          await wait(1200);
        }
        const end=flow();end.label('Last word');end.head('Now act');end.para(d.outro);all.push(...end.pages,endPage());
        all.forEach((cv,i)=>{if(i>0&&i<all.length-1)numberPages([cv],i+1)});
        stat('Building the PDF...');show(await toPdf(all,595,842),'novae-ebook-'+slug(d.title)+'.pdf',all[0],skipped?'<p class="hint">'+skipped+' chapter(s) have no text because the AI was busy. Make it again later for a full book.</p>':'');
      }
      stat('Done. Download it below.');toast('Ready.');
    }catch(e){stat('Stopped: '+msg(e));toast(msg(e))}
    busyDoc=false;b.disabled=false;
  };
  /* ---- week plan ---- */
  const DAYS=['MON','TUE','WED','THU','FRI','SAT','SUN'];
  function drawWeek(list){q('#wkList').innerHTML=list.map((t,i)=>'<div class="snd"><b style="color:'+RED+';flex:0 0 44px">'+DAYS[i]+'</b><span style="white-space:normal">'+esc(t)+'</span><button data-w="'+i+'">Make</button></div>').join('')}
  let week=[];try{week=JSON.parse(localStorage.getItem('lrm_week')||'[]')}catch(e){}
  if(week.length)drawWeek(week);
  q('#wkGo').onclick=async()=>{const b=q('#wkGo');b.disabled=true;b.textContent='Planning...';
    try{const d=await ask(P.week+((q('#apSub')&&q('#apSub').value.trim())||'any'));week=(d.lines||[]).map(l=>String(l.text||'').trim()).filter(Boolean).slice(0,7);
      if(!week.length)throw new Error('ai_empty');try{localStorage.setItem('lrm_week',JSON.stringify(week))}catch(e){}drawWeek(week)}
    catch(e){toast(msg(e))}
    b.disabled=false;b.textContent='Plan my week'};
  q('#wkList').onclick=e=>{const b=e.target.closest('[data-w]');if(!b||!q('#apSub'))return;q('#apSub').value=week[+b.dataset.w];host.scrollIntoView({behavior:'smooth'});q('#apGo').click()};
})();
