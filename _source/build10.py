import sys, json, os
sys.path.insert(0,'/home/claude/lp'); from common import logo, wordmark, INK, WA, WA_ICON, IG
from urllib.parse import quote
OUT='/home/claude/site10'; URL='https://novae-mu.vercel.app/'
D=os.path.dirname(os.path.abspath(__file__))
PROOF=json.load(open(f'{D}/proof.json')); PRICES=json.load(open(f'{D}/prices.json'))
def T(en,pt): return f'<span class="en">{en}</span><span class="pt" lang="pt">{pt}</span>'
def wa(t): return f'https://wa.me/{WA}?text='+quote(t)
def waL(en,pt,cls,inner,src):
    return f'<a class="{cls}" href="{wa(en)}" data-l="href" data-href-en="{wa(en)}" data-href-pt="{wa(pt)}" data-src="{src}" target="_blank" rel="noopener">{inner}</a>'
SEAL=logo(INK,'seal')
def film(src_en,src_pt,cv_en,cv_pt,ten,tpt,dur,cls='fc'):
    return (f'<button type="button" class="{cls}" data-l="data-film,data-poster,data-title" data-film="film/{src_en}" data-film-en="film/{src_en}" data-film-pt="film/{src_pt}" data-poster="film/{cv_en}" data-poster-en="film/{cv_en}" data-poster-pt="film/{cv_pt}" data-title="{ten}" data-title-en="{ten}" data-title-pt="{tpt}">'
            f'<img src="film/{cv_en}" data-l="src" data-src-en="film/{cv_en}" data-src-pt="film/{cv_pt}" alt="" loading="lazy" decoding="async" width="360" height="640"><span><b>{T(ten,tpt)}</b><i>{dur}</i></span></button>')
BRAND=f'<a class="brand" href="#top" aria-label="NOVAE, back to top">{SEAL}{wordmark(INK,"wm")}</a>'
LANG='<button class="lang" type="button" aria-label="Mudar para português"><span data-k="en">EN</span><span data-k="pt">PT</span></button>'
NAV=[('services','Services','Serviços'),('work','Work','Trabalho'),('process','Process','Processo'),('about','About','Sobre'),('faq','FAQ','Perguntas')]
navl=''.join(f'<a href="#{i}">{T(a,b)}</a>' for i,a,b in NAV)
AUD=lambda cls,src: f'<a class="btn {cls}" href="#audit-sec" data-cta="{src}">{T("Get a free audit","Pedir auditoria grátis")}</a>'

# ---------- sections ----------
hero=f'''<section class="hero" id="top"><div class="wrap">
<div class="rv"><p class="eyebrow">{T("Marketing &amp; brand studio · Luanda","Estúdio de marketing e marca · Luanda")}</p>
<h1>{T('Most brands are seen. Few are <span class="mk">chosen.</span>','Muitas marcas são vistas. Poucas são <span class="mk">escolhidas.</span>')}</h1>
<p class="lead">{T("NOVAE positions founders, personal brands and growing businesses in Angola, then builds the brand, content and website that make the right clients choose them.","A NOVAE posiciona fundadores, marcas pessoais e negócios em crescimento em Angola e depois constrói a marca, o conteúdo e o website que fazem os clientes certos escolhê-los.")}</p>
<div class="ctas"><a class="btn solid" href="#audit-sec" data-cta="hero">{T("Get a free positioning audit","Pedir auditoria de posicionamento grátis")}</a><a class="btn" href="#work" data-cta="hero-work">{T("See the work","Ver o trabalho")}</a></div>
<ul class="micro"><li>{T("Reply within 24 hours","Resposta em 24 horas")}</li><li>{T("On WhatsApp","Pelo WhatsApp")}</li><li>{T("No commitment","Sem compromisso")}</li></ul></div>
<a class="bookcard rv" href="book" data-src="hero"><div class="bk"><picture><source srcset="img/book-cover.webp" type="image/webp"><img src="img/book-cover.jpg" alt="The NOVAE book: Position. Presence. Growth." width="518" height="726" fetchpriority="high"></picture></div><p>{T("Read the NOVAE book","Leia o livro NOVAE")}<b>{T("2 min →","2 min →")}</b></p></a>
</div></section>'''

facts=f'''<section class="facts" aria-label="{'At a glance'}"><div class="wrap">
<div class="fact"><b>{T("Strategy first","Estratégia primeiro")}</b><span class="fd">{T("Position before posts, logos or ads.","Posicionamento antes de publicações, logótipos ou anúncios.")}</span></div>
<div class="fact"><b>{T("Founder-led","Liderado pela fundadora")}</b><span class="fd">{T("Lara Abou Saleh, MBA in Marketing.","Lara Abou Saleh, MBA em Marketing.")}</span></div>
<div class="fact"><b>{T("In Luanda","Em Luanda")}</b><span class="fd">{T("Portuguese and English. Reply within 24 hours.","Português e inglês. Resposta em 24 horas.")}</span></div>
</div></section>'''

WHO=[('Founders &amp; entrepreneurs','Fundadores e empreendedores','A good business that people don’t yet see as different.','Um bom negócio que ainda não é visto como diferente.','We position it, give it a face and launch it.','Posicionamos, damos-lhe um rosto e lançamos.'),
     ('Personal brands','Marcas pessoais','Real expertise, but the profile doesn’t show it.','Conhecimento real, mas o perfil não o mostra.','We turn what you know into authority people can see.','Transformamos o que sabe em autoridade que se vê.'),
     ('Growing businesses','Negócios em crescimento','Posting every week, but saying something different every time.','Publica todas as semanas, mas diz algo diferente de cada vez.','One story across Instagram, website and print.','Uma só história no Instagram, no website e na impressão.')]
who=f'''<section class="sec" id="who"><div class="wrap"><div class="rv"><p class="eyebrow">{T("Who we work with","Com quem trabalhamos")}</p><h2 class="h2">{T("Three kinds of clients. <span class=mk>One problem.</span>","Três tipos de clientes. <span class=mk>Um problema.</span>")}</h2>
<p class="lead">{T("People can’t see why they should choose you, so they choose on price.","As pessoas não percebem porque devem escolhê-lo, por isso escolhem pelo preço.")}</p></div>
<div class="cards3">'''+''.join(f'<article class="card rv"><h3>{T(a,b)}</h3><p>{T(c,d)}</p><p class="we">{T(e,f)}</p></article>' for a,b,c,d,e,f in WHO)+'</div></div></section>'

stmt=f'''<section class="sec stmt"><div class="wrap rv"><p class="eyebrow">{T("The problem","O problema")}</p>
<h2>{T("You don’t need more posts. You need a <span class=mk>position.</span>","Não precisa de mais publicações. Precisa de <span class=mk>posicionamento.</span>")}</h2>
<div class="cols"><p>{T("When people can’t see why you’re different, they compare prices. More content only repeats the confusion.","Quando não percebem porque é diferente, comparam preços. Mais conteúdo só repete a confusão.")}</p><p>{T("We decide what your brand should own. Then the name, the look, every post and every page say that one thing.","Decidimos o que a sua marca deve ocupar. Depois o nome, a imagem, cada publicação e cada página dizem essa mesma coisa.")}</p></div></div></section>'''

def price(k):
    v=PRICES.get(k) or ''
    if v: return f'<span class="pv">{T("From "+v+" Kz","Desde "+v+" Kz")}</span>'
    return f'<span class="pv">{T("Price on request","Preço sob consulta")}<small>{T("Fixed after the free audit","Definido após a auditoria gratuita")}</small></span>'
PK=[('position','I','Position','Posicionamento','Know what you own.','Saiba o que ocupa.',
     [('Business, audience and competitor diagnosis','Diagnóstico do negócio, do público e da concorrência'),('Positioning and value proposition','Posicionamento e proposta de valor'),('Key messages and offer structure','Mensagens-chave e estrutura da oferta'),('Personal brand profile and bios, for founders','Perfil de marca pessoal e biografias, para fundadores')],
     ('launching, repositioning, or tired of competing on price','quem está a lançar, a reposicionar-se ou cansado de competir pelo preço'),True),
    ('presence','II','Presence','Presença','Look and sound like the obvious choice.','Pareça e soe como a escolha óbvia.',
     [('Logo and visual identity','Logótipo e identidade visual'),('Brand guidelines','Manual de marca'),('Instagram setup and content plan','Configuração do Instagram e plano de conteúdo'),('Website or landing page','Website ou landing page'),('Catalogues, flyers and print','Catálogos, flyers e impressão')],
     ('new brands, or brands that look different on every channel','marcas novas, ou marcas que parecem diferentes em cada canal'),False),
    ('growth','III','Growth','Crescimento','Turn attention into clients.','Transforme atenção em clientes.',
     [('Campaign strategy and creative','Estratégia e criativos de campanha'),('Lead generation through WhatsApp and landing pages','Geração de contactos pelo WhatsApp e landing pages'),('Monthly content production','Produção mensal de conteúdo'),('Reports with real numbers only','Relatórios só com números reais')],
     ('brands with a clear position, ready to grow','marcas com posicionamento claro, prontas para crescer'),False)]
def pkg(k,n,en,pt,ten,tpt,items,fr,feat):
    return (f'<article class="pkg rv{" feat" if feat else ""}" data-l="data-badge" data-badge="Start here" data-badge-en="Start here" data-badge-pt="Comece aqui"><p class="n">{n}</p><h3>{T(en,pt)}</h3><p class="tag">{T(ten,tpt)}</p><ul>'
            +''.join(f'<li>{T(a,b)}</li>' for a,b in items)+f'</ul><p class="for"><b>{T("Best for:","Ideal para:")}</b> {T(fr[0],fr[1])}</p>'
            f'<div class="price">{price(k)}'+waL(f'Hello NOVAE, I’d like to know more about {en}.',f'Olá NOVAE, gostaria de saber mais sobre {pt}.','link',T('Ask about '+en+' →','Saber mais →'),'pkg-'+k)+'</div></article>')
services=f'''<section class="sec" id="services"><div class="wrap"><div class="rv"><p class="eyebrow">{T("Services","Serviços")}</p><h2 class="h2">{T("Position. Presence. <span class=mk>Growth.</span>","Posição. Presença. <span class=mk>Crescimento.</span>")}</h2>
<p class="lead">{T("Three services that build on each other. Each one ends with something you keep and can use.","Três serviços que se constroem um sobre o outro. Cada um termina com algo que fica consigo e pode usar.")}</p></div>
<div class="pk">'''+''.join(pkg(*p) for p in PK)+f'''</div><p class="note rv">{T('Not sure where to start? <a href="#audit-sec" data-cta="services-note">The free audit tells you.</a>','Não sabe por onde começar? <a href="#audit-sec" data-cta="services-note">A auditoria gratuita diz-lhe.</a>')}</p></div></section>'''

# Lumière proof: shown only when real data exists
q=PROOF.get('quote',{}); mets=[m for m in PROOF.get('metrics',[]) if str(m.get('value','')).strip()]
if mets:
    res=(f'<div class="results has rv"><p class="eyebrow">{T("First week after launch","Primeira semana após o lançamento")}</p><div class="metrics">'+''.join(f'<div class="metric"><b>{m["value"]}</b><span class="ml">{T(m["label_en"],m["label_pt"])}</span></div>' for m in mets)
         +f'</div><small>{T("Source: "+PROOF.get("source_en",""),"Fonte: "+PROOF.get("source_pt",""))}</small></div>')
else:
    res=f'<div class="results rv"><p>{T("Launch results (reach, first sale, post views) are being measured and will be published here.","Os resultados do lançamento (alcance, primeira venda, visualizações) estão a ser medidos e serão publicados aqui.")}</p></div>'
quote_html=''
if q.get('en') and q.get('author'):
    quote_html=f'<blockquote class="quote rv">{T("“"+q["en"]+"”","“"+(q.get("pt") or q["en"])+"”")}<cite>{q["author"]} · {T(q.get("role_en",""),q.get("role_pt",""))}</cite></blockquote>'
LS=[('lumiere-logo.jpg','The logo','O logótipo','Lumière Beauty logo: an L in a circle with a leafy branch'),('lumiere-post-2.jpg','Who we are','Quem somos','Lumière launch post: who we are'),('lumiere-post-3.jpg','Coming soon','Em breve','Lumière launch post: something beautiful is coming soon')]
work=f'''<section class="sec" id="work" style="background:var(--white)"><div class="wrap"><div class="rv"><p class="eyebrow">{T("Case study","Caso de estudo")}</p><h2 class="h2">Lumière Beauty</h2>
<p class="lead">{T("A beauty, skin and self-care space in Luanda. We built the brand before the doors opened.","Um espaço de beleza, pele e autocuidado em Luanda. Construímos a marca antes de as portas abrirem.")}</p></div>
<div class="case"><dl class="rv"><dt>{T("The challenge","O desafio")}</dt><dd>{T("Be noticed, and trusted, before opening day.","Ser notada, e merecer confiança, antes do dia da abertura.")}</dd>
<dt>{T("The position","A posição")}</dt><dd class="q">{T("“More than a <span class=mk>salon.</span>”","“Mais do que um <span class=mk>salão.</span>”")}</dd><dd>{T("Expert care, quality treatments and selected products in one place: look good, feel good, feel confident.","Cuidado especializado, tratamentos de qualidade e produtos escolhidos num só lugar: ficar bem, sentir-se bem, sentir-se confiante.")}</dd>
<dt>{T("What we did","O que fizemos")}</dt><dd><ul class="did"><li>{T("Positioning","Posicionamento")}</li><li>{T("Logo &amp; identity","Logótipo e identidade")}</li><li>{T("Instagram launch","Lançamento no Instagram")}</li><li>{T("First posts","Primeiras publicações")}</li><li>{T("Two films","Dois filmes")}</li></ul></dd></dl>
<div><div class="shots rv">'''+''.join(f'<figure><img src="img/{f}" alt="{alt}" loading="lazy" decoding="async" width="600" height="750"><figcaption>{T(a,b)}</figcaption></figure>' for f,a,b,alt in LS)+f'''</div>
<div class="films2 rv">{film('lumiere-film.mp4','lumiere-film.mp4','lumiere-film-cover-en.jpg','lumiere-film-cover-pt.jpg','Launch film','Filme de lançamento','15 s')}{film('lumiere-xray-en.mp4','lumiere-xray-pt.mp4','lumiere-xray-cover-en.jpg','lumiere-xray-cover-pt.jpg','Brand X-ray','Raio-X da marca','15 s')}</div>
{res}{quote_html}<p class="rv" style="margin:18px 0 0"><a class="link" href="https://instagram.com/lumiere.beauty.ao" target="_blank" rel="noopener">{T("See @lumiere.beauty.ao on Instagram →","Ver @lumiere.beauty.ao no Instagram →")}</a></p></div></div></div></section>'''

HOW=[('Audit','Auditoria','Free. Your brand, audience and competitors, studied.','Gratuita. A sua marca, o seu público e a concorrência, estudados.','What to fix first, and a clear proposal.','O que corrigir primeiro e uma proposta clara.'),
     ('Position','Posicionamento','What you should own, and how to say it.','O que deve ocupar e como dizê-lo.','Positioning, message and offer.','Posicionamento, mensagem e oferta.'),
     ('Build','Construção','Identity, content and website, built from the position.','Identidade, conteúdo e website, a partir do posicionamento.','Brand kit, content plan, the site.','Kit de marca, plano de conteúdo, o site.'),
     ('Launch &amp; grow','Lançar e crescer','We publish, measure and adjust.','Publicamos, medimos e ajustamos.','Reports with real numbers only.','Relatórios só com números reais.')]
process=f'''<section class="sec" id="process"><div class="wrap"><div class="rv"><p class="eyebrow">{T("Process","Processo")}</p><h2 class="h2">{T("How we <span class=mk>work.</span>","Como <span class=mk>trabalhamos.</span>")}</h2>
<p class="lead">{T("Four steps. The first one is free, and you decide after it.","Quatro passos. O primeiro é gratuito, e decide depois dele.")}</p></div>
<div class="steps">'''+''.join(f'<div class="step rv"><h3>{T(a,b)}</h3><p>{T(c,d)}</p><p class="get"><i>{T("You get","Recebe")}</i>{T(e,f)}</p></div>' for a,b,c,d,e,f in HOW)+'</div></div></section>'

FILMS=[('drop','From a drop to a brand','De uma gota a uma marca','24 s'),('logo','Logo reveal','Revelação do logótipo','6 s'),('seal','The seal, explained','O selo, explicado','15 s'),('xray','Brand X-ray','Raio-X da marca','15 s'),('place','Every star has a place','Cada estrela tem um lugar','15 s')]
films=f'''<section class="sec tight" id="films"><div class="wrap"><div class="rv"><p class="eyebrow">{T("Screening room","Sala de cinema")}</p><h2 class="h2" style="font-size:clamp(30px,3.6vw,44px)">{T("How we think, in 15 seconds.","Como pensamos, em 15 segundos.")}</h2></div>
<div class="reel rv">'''+''.join(film(f'novae-{k}-en.mp4',f'novae-{k}-pt.mp4',f'novae-{k}-cover-en.jpg',f'novae-{k}-cover-pt.jpg',a,b,d,'') for k,a,b,d in FILMS)+'</div></div></section>'

book=f'''<section class="sec bookband"><div class="wrap"><a class="bookcard rv" href="book" data-src="band"><div class="bk"><picture><source srcset="img/book-cover.webp" type="image/webp"><img src="img/book-cover.jpg" alt="" width="518" height="726" loading="lazy"></picture></div></a>
<div class="rv"><p class="eyebrow">{T("The NOVAE book","O livro NOVAE")}</p><h2 class="h2">{T("Everything above, in 14 pages you can <span class=mk>turn.</span>","Tudo isto, em 14 páginas que pode <span class=mk>virar.</span>")}</h2>
<p class="lead">{T("Our studio told as a hardcover book: real page turns, three covers to choose from, two minutes to read. It is how we show what a brand experience can feel like.","O nosso estúdio contado como um livro de capa dura: páginas que viram, três capas à escolha, dois minutos de leitura. É assim que mostramos o que uma experiência de marca pode ser.")}</p>
<div class="ctas" style="margin-top:28px"><a class="btn solid" href="book" data-src="band-btn">{T("Open the book →","Abrir o livro →")}</a></div></div></div></section>'''

about=f'''<section class="sec" id="about"><div class="wrap founder"><img class="rv" src="img/lara-portrait.jpg" alt="Lara Abou Saleh, founder of NOVAE" loading="lazy" decoding="async" width="600" height="750">
<div class="rv"><p class="eyebrow">{T("Founder","Fundadora")}</p><h2 class="h2">Lara Abou Saleh</h2><p class="lead">{T("Founder of NOVAE. MBA in Marketing. Builds every brand like her own.","Fundadora da NOVAE. MBA em Marketing. Constrói cada marca como se fosse a sua.")}</p>
<p class="sig">{T("“Write to me. I read every message myself.”","“Escreva-me. Leio cada mensagem pessoalmente.”")}</p>
'''+waL("Hello Lara, I’d like to talk about my brand.","Olá Lara, gostaria de falar sobre a minha marca.","btn solid",WA_ICON+" "+T("Write to Lara","Escrever à Lara"),'founder')+'</div></div></section>'

FAQ=[('What exactly is the free audit?','O que é exatamente a auditoria gratuita?','We study your brand, your audience and your competitors. You receive what to fix first and a clear proposal. Free, with no commitment.','Estudamos a sua marca, o seu público e a sua concorrência. Recebe o que corrigir primeiro e uma proposta clara. Gratuita e sem compromisso.'),
     ('How much does it cost?','Quanto custa?','It depends on the scope. After the free audit you receive a clear proposal with the price before any work starts.','Depende do âmbito. Depois da auditoria gratuita recebe uma proposta clara com o preço antes de qualquer trabalho começar.'),
     ('Who do you work with?','Com quem trabalham?','Founders, personal brands and growing businesses that want to be chosen for more than price.','Fundadores, marcas pessoais e negócios em crescimento que querem ser escolhidos por mais do que o preço.'),
     ('How fast do you reply?','Em quanto tempo respondem?','Within 24 hours, on WhatsApp.','Em 24 horas, pelo WhatsApp.'),
     ('What happens after I send the form?','O que acontece depois de enviar o formulário?','WhatsApp opens with your answers already written. Press send, and Lara replies within 24 hours.','O WhatsApp abre com as suas respostas já escritas. Carregue em enviar e a Lara responde em 24 horas.')]
faq=f'''<section class="sec" id="faq" style="background:var(--white)"><div class="wrap"><div class="rv"><p class="eyebrow">{T("Questions","Perguntas")}</p><h2 class="h2">{T("Before you write.","Antes de escrever.")}</h2></div><div class="faq rv">'''+''.join(f'<details><summary>{T(a,b)}</summary><p>{T(c,d)}</p></details>' for a,b,c,d in FAQ)+'</div></div></section>'

PROB=[('Nobody notices us','Ninguém nos nota'),('People choose on price','Escolhem pelo preço'),('No time for content','Sem tempo para conteúdo'),('Launching something new','Vamos lançar algo novo')]
chips=''.join(f'<label class="chip"><input type="radio" name="p" value="{i}"><span class="cs">{T(a,b)}</span></label>' for i,(a,b) in enumerate(PROB))
audit=f'''<section class="sec auditsec" id="audit-sec"><div class="wrap"><div class="rv"><p class="eyebrow">{T("Free positioning audit","Auditoria de posicionamento gratuita")}</p>
<h2 class="h2">{T("Your next chapter starts with <span class=mk>a free audit.</span>","O seu próximo capítulo começa com <span class=mk>uma auditoria gratuita.</span>")}</h2>
<p class="lead">{T("Three questions. Lara replies on WhatsApp within 24 hours.","Três perguntas. A Lara responde pelo WhatsApp em 24 horas.")}</p>
<ul class="recv"><li>{T("What to fix first in your brand","O que corrigir primeiro na sua marca")}</li><li>{T("The position your brand could own","A posição que a sua marca pode ocupar")}</li><li>{T("A clear proposal, with the price","Uma proposta clara, com o preço")}</li></ul></div>
<div class="formcard rv"><form class="audit" id="audit" data-wa="{WA}" novalidate>
<label class="f">{T("1 · Your brand","1 · A sua marca")}<input name="b" autocomplete="organization" required></label>
<label class="f">{T("2 · Instagram or website (optional)","2 · Instagram ou website (opcional)")}<input name="u" inputmode="url" placeholder="@" ></label>
<fieldset><legend>{T("3 · What’s holding you back?","3 · O que o está a travar?")}</legend><div class="chips">{chips}</div></fieldset>
<p class="err" id="auderr" role="alert"></p>
<button class="btn solid" type="submit">{WA_ICON} {T("Send on WhatsApp","Enviar pelo WhatsApp")}</button></form>
<div class="sent" id="sent" tabindex="-1" hidden><p class="eyebrow">{T("Ready in WhatsApp","Pronto no WhatsApp")}</p><h3>{T("Press send in WhatsApp.","Carregue em enviar no WhatsApp.")}</h3><p>{T("Lara replies within 24 hours.","A Lara responde em 24 horas.")}</p><a class="btn solid" id="sentwa" href="#" target="_blank" rel="noopener" data-src="sent">{WA_ICON} {T("Open WhatsApp again","Abrir o WhatsApp de novo")}</a><button class="again" type="button" id="edit">{T("Edit my answers","Editar respostas")}</button></div>
<p class="alt">{T("Prefer to just say hello?","Prefere só dizer olá?")} '''+waL("Hello NOVAE.","Olá NOVAE.","",T("Open WhatsApp","Abrir o WhatsApp"),'alt')+'</p></div></div></section>'

footer=f'''<footer class="ft"><div class="wrap"><div>{BRAND.replace('href="#top"','href="#top"')}<p class="slogan">{T("Position. Presence. Growth.","Posição. Presença. Crescimento.")}</p></div>
<div><p><b>NOVAE</b></p><p>{T("Marketing &amp; brand studio","Estúdio de marketing e marca")}</p><p>Luanda, Angola</p><p>© 2026</p></div>
<div><p><a href="https://instagram.com/{IG}" target="_blank" rel="noopener">Instagram · @{IG}</a></p><p>'''+waL("Hello NOVAE.","Olá NOVAE.","","WhatsApp",'footer')+f'''</p><p><a href="book" data-src="footer">{T("The NOVAE book","O livro NOVAE")}</a></p><p><a href="#audit-sec">{T("Free audit","Auditoria grátis")}</a></p></div></div></footer>'''

mbar=f'''<nav class="mbar" id="mbar" aria-label="Quick contact"><a class="btn solid" href="#audit-sec" data-cta="bar">{T("Free audit","Auditoria grátis")}</a>'''+waL("Hello NOVAE, I’d like a free positioning audit.","Olá NOVAE, gostaria de uma auditoria de posicionamento gratuita.","btn wab",WA_ICON+'<span class="wl">'+T("Reply in 24h","Resposta em 24h")+'</span>','bar')+'</nav>'

# ===================== v10 · compact page: detail opens on demand =====================
NAV=[('services','Services','Serviços'),('work','Work','Trabalho'),('process','Process','Processo'),('see','Book &amp; films','Livro e filmes'),('faq','FAQ','Perguntas')]
navl=''.join(f'<a href="#{i}">{T(a,b)}</a>' for i,a,b in NAV)
# 1 · problem + who, one black band, client types as swipe cards
problem=f'''<section class="sec stmt" id="who"><div class="wrap"><div class="rv"><p class="eyebrow">{T("The problem","O problema")}</p>
<h2>{T("You don’t need more posts. You need a <span class=mk>position.</span>","Não precisa de mais publicações. Precisa de <span class=mk>posicionamento.</span>")}</h2>
<p class="stl">{T("When people can’t see why you’re different, they compare prices. We decide what your brand should own, then every post and every page says it.","Quando não percebem porque é diferente, comparam preços. Decidimos o que a sua marca deve ocupar e depois cada publicação e cada página dizem isso.")}</p></div>
<p class="eyebrow sm rv">{T("Who we work with","Com quem trabalhamos")}</p><div class="swipe rv" role="list">'''+''.join(f'<article class="dcard" role="listitem"><h3>{T(a,b)}</h3><p>{T(c,d)}</p><p class="we">{T(e,f)}</p></article>' for a,b,c,d,e,f in WHO)+'''</div></div></section>'''
# 2 · services as tabs
def tabpanel(i,k,n,en,pt,ten,tpt,items,fr,feat):
    return (f'<div class="tp" role="tabpanel" id="tp-{k}" aria-labelledby="tb-{k}"{"" if i==0 else " hidden"}><div class="tpl"><p class="n">{n}{" · "+T("Start here","Comece aqui") if feat else ""}</p><h3>{T(en,pt)}</h3><p class="tag">{T(ten,tpt)}</p>'
            f'<p class="for"><b>{T("Best for:","Ideal para:")}</b> {T(fr[0],fr[1])}</p><div class="price">{price(k)}'
            +waL(f'Hello NOVAE, I’d like to know more about {en}.',f'Olá NOVAE, gostaria de saber mais sobre {pt}.','btn solid sm',WA_ICON+' '+T('Ask about '+en,'Saber mais sobre '+pt),'pkg-'+k)+'</div></div>'
            f'<details class="inc" open><summary>{T("What’s included","O que inclui")} <em class="ct">{len(items)}</em></summary><ul>'+''.join(f'<li>{T(a,b)}</li>' for a,b in items)+'</ul></details></div>')
services=f'''<section class="sec" id="services"><div class="wrap"><div class="rv svh"><div><p class="eyebrow">{T("Services","Serviços")}</p><h2 class="h2">{T("Position. Presence. <span class=mk>Growth.</span>","Posição. Presença. <span class=mk>Crescimento.</span>")}</h2></div>
<p class="lead">{T("Three services that build on each other. Pick one to see what’s included.","Três serviços que se constroem um sobre o outro. Escolha um para ver o que inclui.")}</p></div>
<div class="tabs rv"><div class="tl" role="tablist" aria-label="Services">'''+''.join(f'<button type="button" role="tab" id="tb-{p[0]}" aria-controls="tp-{p[0]}" aria-selected="{"true" if i==0 else "false"}" tabindex="{0 if i==0 else -1}"><i>{p[1]}</i>{T(p[2],p[3])}</button>' for i,p in enumerate(PK))+'</div>'+''.join(tabpanel(i,*p) for i,p in enumerate(PK))+f'''</div>
<p class="note rv">{T('Not sure where to start? <a href="#audit-sec" data-cta="services-note">The free audit tells you.</a>','Não sabe por onde começar? <a href="#audit-sec" data-cta="services-note">A auditoria gratuita diz-lhe.</a>')}</p></div></section>'''
# 3 · Lumière: visuals first, the case opens on demand
work=f'''<section class="sec" id="work" style="background:var(--white)"><div class="wrap"><div class="rv svh"><div><p class="eyebrow">{T("Case study","Caso de estudo")}</p><h2 class="h2">Lumière Beauty</h2></div>
<p class="lead">{T("A beauty, skin and self-care space in Luanda. We built the brand before the doors opened.","Um espaço de beleza, pele e autocuidado em Luanda. Construímos a marca antes de as portas abrirem.")}</p></div>
<div class="wk"><div class="shots rv">'''+''.join(f'<figure><img src="img/{f}" alt="{alt}" loading="lazy" decoding="async" width="600" height="750"><figcaption>{T(a,b)}</figcaption></figure>' for f,a,b,alt in LS)+f'''</div>
<div class="wkr rv"><p class="q">{T("“More than a <span class=mk>salon.</span>”","“Mais do que um <span class=mk>salão.</span>”")}</p>
<div class="films2">{film('lumiere-film.mp4','lumiere-film.mp4','lumiere-film-cover-en.jpg','lumiere-film-cover-pt.jpg','Launch film','Filme de lançamento','15 s')}{film('lumiere-xray-en.mp4','lumiere-xray-pt.mp4','lumiere-xray-cover-en.jpg','lumiere-xray-cover-pt.jpg','Brand X-ray','Raio-X da marca','15 s')}</div>
<details class="more"><summary>{T("Read the case","Ler o caso")}</summary><dl><dt>{T("The challenge","O desafio")}</dt><dd>{T("Be noticed, and trusted, before opening day.","Ser notada, e merecer confiança, antes do dia da abertura.")}</dd>
<dt>{T("The position","A posição")}</dt><dd>{T("Expert care, quality treatments and selected products in one place: look good, feel good, feel confident.","Cuidado especializado, tratamentos de qualidade e produtos escolhidos num só lugar: ficar bem, sentir-se bem, sentir-se confiante.")}</dd>
<dt>{T("What we did","O que fizemos")}</dt><dd><ul class="did"><li>{T("Positioning","Posicionamento")}</li><li>{T("Logo &amp; identity","Logótipo e identidade")}</li><li>{T("Instagram launch","Lançamento no Instagram")}</li><li>{T("First posts","Primeiras publicações")}</li><li>{T("Two films","Dois filmes")}</li></ul></dd></dl></details>
{res}{quote_html}<p style="margin:14px 0 0"><a class="link" href="https://instagram.com/lumiere.beauty.ao" target="_blank" rel="noopener">{T("See @lumiere.beauty.ao →","Ver @lumiere.beauty.ao →")}</a></p></div></div></div></section>'''
# 4 · process: a timeline, each step opens on tap
process=f'''<section class="sec" id="process"><div class="wrap"><div class="rv svh"><div><p class="eyebrow">{T("Process","Processo")}</p><h2 class="h2">{T("How we <span class=mk>work.</span>","Como <span class=mk>trabalhamos.</span>")}</h2></div>
<p class="lead">{T("Four steps. The first is free, and you decide after it.","Quatro passos. O primeiro é gratuito, e decide depois dele.")}</p></div>
<div class="tline rv"><div class="tl2" role="tablist" aria-label="Process">'''+''.join(f'<button type="button" role="tab" id="ps-{i}" aria-controls="pp-{i}" aria-selected="{"true" if i==0 else "false"}" tabindex="{0 if i==0 else -1}"><i>0{i+1}</i>{T(a,b)}</button>' for i,(a,b,c,d,e,f) in enumerate(HOW))+'</div>'+''.join(f'<div class="pp" role="tabpanel" id="pp-{i}" aria-labelledby="ps-{i}"{"" if i==0 else " hidden"}><p>{T(c,d)}</p><p class="get"><i>{T("You get","Recebe")}</i> {T(e,f)}</p></div>' for i,(a,b,c,d,e,f) in enumerate(HOW))+'</div></div></section>'
# 5 · see & read: the book and the films side by side
seemeet=f'''<section class="sec bookband" id="see"><div class="wrap"><div class="rv svh"><div><p class="eyebrow">{T("See &amp; read","Ver e ler")}</p><h2 class="h2">{T("The studio, in 14 pages and five films.","O estúdio, em 14 páginas e cinco filmes.")}</h2></div></div>
<div class="sr"><a class="bookcard rv" href="book" data-src="band"><div class="bk"><picture><source srcset="img/book-cover.webp" type="image/webp"><img src="img/book-cover.jpg" alt="The NOVAE book" width="518" height="726" loading="lazy"></picture></div><p>{T("Open the book","Abrir o livro")}<b>{T("2 min →","2 min →")}</b></p></a>
<div class="reel rv">'''+''.join(film(f'novae-{k}-en.mp4',f'novae-{k}-pt.mp4',f'novae-{k}-cover-en.jpg',f'novae-{k}-cover-pt.jpg',a,b,d,'') for k,a,b,d in FILMS)+'</div></div></div></section>'
# 6 · audit with Lara beside the form
lara=f'''<div class="lara" id="about"><img src="img/lara-portrait.jpg" alt="Lara Abou Saleh, founder of NOVAE" loading="lazy" width="120" height="150"><div><b>Lara Abou Saleh</b><span>{T("Founder · MBA in Marketing","Fundadora · MBA em Marketing")}</span><i>{T("“I read every message myself.”","“Leio cada mensagem pessoalmente.”")}</i></div></div>'''
audit=audit.replace('<ul class="recv">',lara+'<ul class="recv">')

# 7 · phone: proof in the hero, swipe dots for Lumière
latest=f'<a class="latest" href="#work" data-cta="hero-latest"><img src="img/lumiere-logo.jpg" alt="" width="44" height="44"><span class="lt">{T("Latest launch","Último lançamento")}<b>Lumière Beauty →</b></span></a>'
assert '</ul></div>\n<a class="bookcard' in hero
hero=hero.replace('</ul></div>\n<a class="bookcard','</ul>'+latest+'</div>\n<a class="bookcard',1)
work=work.replace('</figure></div>\n<div class="wkr','</figure></div><div class="dots" aria-hidden="true"><i class="on"></i><i></i><i></i></div>\n<div class="wkr',1)
assert 'class="dots"' in work

# 8 · Lumière proof: real numbers in a strip under the hero and at the top of the case
mets=[m for m in PROOF.get('metrics',[]) if str(m.get('value','')).strip()]
if mets:
    hero=hero.replace(latest,'')
    newres=(f'<div class="results has"><p class="eyebrow">{T(PROOF["period_en"],PROOF["period_pt"])}</p><div class="metrics m{len(mets)}">'
        +''.join(f'<div class="metric"><b>{T(m["value"],m.get("value_pt") or m["value"])}</b><span class="ml">{T(m["label_en"],m["label_pt"])}</span></div>' for m in mets)
        +f'</div><small>{T(PROOF["source_en"],PROOF["source_pt"])}</small></div>')
    work=work.replace(res,'').replace('<div class="films2">',newres+'<div class="films2">',1)
    sm=[m for m in mets if m.get('strip')]
    facts=(f'<section class="pstrip" aria-label="Lumière Beauty"><div class="wrap"><a href="#work" data-cta="proof-strip"><span class="pl"><img src="img/lumiere-logo.jpg" alt="" width="40" height="40"><span><i>{T("Latest launch · new account","Último lançamento · conta nova")}</i>Lumière Beauty</span></span>'
        +''.join(f'<span class="pn"><b>{T(m["value"],m.get("value_pt") or m["value"])}</b><span class="ml">{T(m["label_en"],m["label_pt"])}</span></span>' for m in sm)
        +f'<span class="go">{T("See the case →","Ver o caso →")}</span></a></div></section>')

# 9 · copy v12, founder full section before the audit, questions folded into one row
_old_lead='NOVAE positions founders, personal brands and growing businesses in Angola, then builds the brand, content and website that make the right clients choose them.'
_old_lead_pt='A NOVAE posiciona fundadores, marcas pessoais e negócios em crescimento em Angola e depois constrói a marca, o conteúdo e o website que fazem os clientes certos escolhê-los.'
assert _old_lead in hero and _old_lead_pt in hero
hero=hero.replace(_old_lead,'We position founders and growing brands so the right clients choose them.').replace(_old_lead_pt,'Posicionamos fundadores e marcas em crescimento para que os clientes certos os escolham.')
_h_en='You don’t need more posts. You need a <span class=mk>position.</span>';_h_pt='Não precisa de mais publicações. Precisa de <span class=mk>posicionamento.</span>'
_l_en='When people can’t see why you’re different, they compare prices. We decide what your brand should own, then every post and every page says it.'
_l_pt='Quando não percebem porque é diferente, comparam preços. Decidimos o que a sua marca deve ocupar e depois cada publicação e cada página dizem isso.'
for o in (_h_en,_h_pt,_l_en,_l_pt): assert o in problem
problem=(problem.replace(_h_en,'Followers don’t pay. <span class=mk>Clients do.</span>').replace(_h_pt,'Seguidores não pagam. <span class=mk>Clientes pagam.</span>')
  .replace(_l_en,'Being visible without a clear reason to choose you ends in a price comparison. We define that reason first, then build everything around it.')
  .replace(_l_pt,'Ser visto sem uma razão clara para ser escolhido acaba numa comparação de preços. Definimos essa razão primeiro e construímos tudo à volta dela.'))
audit=audit.replace(lara,'')
faq=(f'<section class="sec" id="faq" style="background:var(--white)"><div class="wrap"><details class="faqall rv"><summary><span class="fh"><span class="eyebrow">{T("Questions","Perguntas")}</span><h2 class="h2">{T("Before you write.","Antes de escrever.")}</h2></span>'
     f'<span class="fx">{T(str(len(FAQ))+" answers",str(len(FAQ))+" respostas")}</span></summary><div class="faq">'
     +''.join(f'<details><summary>{T(a,b)}</summary><p>{T(c,d)}</p></details>' for a,b,c,d in FAQ)+'</div></details></div></section>')

FONTS=''.join(f"@font-face{{font-family:'{f}';font-style:{st};font-weight:{w};font-display:swap;src:url(fonts/{u}) format('woff2')}}" for f,st,w,u in [('EB Garamond','normal',400,'eb-garamond-400-normal.woff2'),('EB Garamond','italic',400,'eb-garamond-400-italic.woff2'),('EB Garamond','normal',500,'eb-garamond-500-normal.woff2'),('Inter','normal',400,'inter-latin-400-normal.woff2'),('Inter','normal',500,'inter-latin-500-normal.woff2')])
CSS=open(f'{D}/site.css').read()+open(f'{D}/site10.css').read(); JS=open(f'{D}/site.js').read()+open(f'{D}/site10.js').read()
LD=json.dumps({"@context":"https://schema.org","@type":"ProfessionalService","name":"NOVAE","description":"Estúdio de marketing e marca em Luanda: posicionamento, identidade, conteúdo, websites e crescimento.","slogan":"Position. Presence. Growth.","url":URL,"image":URL+"og-image.jpg","areaServed":"Angola","address":{"@type":"PostalAddress","addressLocality":"Luanda","addressCountry":"AO"},"founder":{"@type":"Person","name":"Lara Abou Saleh"},"sameAs":[f"https://instagram.com/{IG}"],"knowsLanguage":["pt","en"]},ensure_ascii=False)
html=f'''<!doctype html><html lang="pt-AO" data-lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<script>(function(){{var d=document.documentElement,l;try{{l=localStorage.getItem('novae-lang')}}catch(e){{}}if(!l)l=(navigator.language||'').toLowerCase().indexOf('pt')===0?'pt':'en';d.setAttribute('data-lang',l);d.lang=l==='pt'?'pt-AO':'en'}})();</script>
<script>window.va=window.va||function(){{(window.vaq=window.vaq||[]).push(arguments)}};</script><script defer src="/_vercel/insights/script.js"></script>
<title>NOVAE · Estúdio de marketing e marca em Luanda</title>
<meta name="description" content="A NOVAE posiciona fundadores, marcas pessoais e negócios em crescimento em Angola: posicionamento, identidade, conteúdo, websites e campanhas. Auditoria gratuita, resposta em 24 horas.">
<meta name="theme-color" content="#FAF7F1"><link rel="canonical" href="{URL}">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_AO"><meta property="og:locale:alternate" content="en_US"><meta property="og:url" content="{URL}"><meta property="og:title" content="NOVAE · Muitas marcas são vistas. Poucas são escolhidas.">
<meta property="og:description" content="Lumière Beauty, uma conta nova: 12 602 visualizações em 14 dias e a primeira venda na primeira semana. Auditoria de posicionamento gratuita, resposta em 24 horas."><meta property="og:image" content="{URL}og-image.jpg?v=2"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta property="og:image:alt" content="NOVAE · Lumière Beauty: 12 602 visualizações em 14 dias, primeira venda na primeira semana"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="icon" href="favicon.ico" sizes="48x48"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="manifest" href="site.webmanifest">
<link rel="preload" href="fonts/eb-garamond-400-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="img/book-cover.webp" as="image" type="image/webp">
<script type="application/ld+json">{LD}</script>
<style>{FONTS}{CSS}</style></head><body>
<a class="skip" href="#main">{T("Skip to content","Saltar para o conteúdo")}</a>
<header class="hd"><div class="wrap">{BRAND}<nav class="nav" aria-label="Main">{navl}</nav>{LANG}<span class="hdcta">{AUD("solid","header")}</span><button class="menu" id="menu" type="button" aria-expanded="false" aria-controls="sheet" aria-label="Menu"><i></i><i></i></button></div></header>
<div class="sheet" id="sheet">{navl}<a href="book">{T("The NOVAE book","O livro NOVAE")}</a>{AUD("solid","menu")}</div>
<main id="main">{hero}{facts}{problem}{services}{work}{process}{seemeet}{faq}{about}{audit}</main>{footer}{mbar}
<div class="lb" id="lb" hidden><div class="lbc" role="dialog" aria-modal="true" aria-label="Film"><video id="vid" playsinline controls preload="none"></video><p id="vt"></p><button type="button" class="x" id="lbx" aria-label="Close film">×</button></div></div>
<script>{JS}</script></body></html>'''
os.makedirs(OUT,exist_ok=True); open(f'{OUT}/index.html','w').write(html); print(len(html))
