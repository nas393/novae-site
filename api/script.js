export const config = { runtime: 'edge' };
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const PROMPT = `You write Instagram Reel scripts for NOVAE (@novae.brandstudio), a brand and marketing studio in Luanda, Angola.
Audience: founders, personal brands and growing businesses in Angola. Topics: brand strategy, positioning, visual identity, content, websites, campaigns and sales.
Voice: elegant, clear, expert and warm. Practical advice a business owner can use today. No emojis. No hashtags inside lines. No cliches. No hype.
Task: from the subject below (typed text and/or a screenshot), write one reel.
Rules:
- 5 or 6 lines. Line 1 is a hook that stops the scroll. The last line is the takeaway or the action.
- Each line: 4 to 10 words. One idea per line.
- "accent": the ONE most powerful word of that line, copied exactly as it appears in the line.
- "visual": a 2-3 word stock footage search for that line, always in English. Concrete, premium, warm light. Good: "marble texture", "african businesswoman", "luanda city", "design studio desk", "coffee meeting", "laptop desk minimal", "gold details", "handshake business", "camera photographer", "shop owner smiling". Avoid text, logos and screens with words.
- "caption": 2 short sentences plus a call to follow @novae.brandstudio or book a free audit.
- "hashtags": 8 tags, no # sign. Mix Angola and business tags (e.g. luanda, angola, empreendedorismo, marketingdigital, branding).
- "sound": a 2-word music mood search in English, like "elegant piano" or "soft jazz".
Return ONLY JSON:
{"subject":"...","lines":[{"text":"...","accent":"...","visual":"..."}],"caption":"...","hashtags":["..."],"sound":"..."}`;
const LANG = {
  pt: 'LANGUAGE: write every line, the caption, the ideas and any document text in Portuguese as written in Angola (pt-AO): natural, clear, correct accents, no Brazilian slang. Keep "visual" and "sound" in English.',
  en: 'LANGUAGE: write every line, the caption, the ideas and any document text in simple English.'
};
export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'post_only' }, 405);
  const key = req.headers.get('x-gemini-key') || process.env.GEMINI_API_KEY;
  if (!key) return json({ error: 'no_ai_key' }, 401);
  const models = [process.env.GEMINI_MODEL, 'gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'].filter(Boolean);
  const run = async () => {
    let body;
    try { body = await req.json(); } catch (e) { return { error: 'bad_json' }; }
    const text = String(body.text || '').slice(0, 4000);
    const img = body.image && typeof body.image.data === 'string' ? body.image : null;
    if (!text && !img) return { error: 'empty' };
    const parts = [{ text: PROMPT + '\n' + (LANG[body.lang] || LANG.pt) + '\n\nSUBJECT:\n' + (text || '(see the screenshot: read it, find its subject and theme, and build the reel on that)') }];
    if (img) parts.push({ inline_data: { mime_type: img.mime || 'image/jpeg', data: img.data } });
    let last = 'ai_failed';
    for (const m of models) {
      let r;
      try {
        r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
          method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': key }, signal: AbortSignal.timeout(50000),
          body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { responseMimeType: 'application/json', temperature: 0.9 } })
        });
      } catch (e) { last = 'ai_slow'; continue; }
      if (r.status === 401 || r.status === 403) return { error: 'bad_ai_key' };
      if (r.status === 400) { const t = await r.text(); if (/API key not valid|API_KEY_INVALID/i.test(t)) return { error: 'bad_ai_key' }; last = 'ai_400'; continue; }
      if (!r.ok) { if (r.status !== 404 || last === 'ai_failed') last = 'ai_' + r.status; continue; }
      try {
        const d = await r.json();
        let out = ((((d.candidates || [])[0] || {}).content || {}).parts || []).map(p => p.text || '').join('').trim();
        const a = out.indexOf('{'), b = out.lastIndexOf('}');
        const j = JSON.parse(out.slice(a, b + 1));
        if (Array.isArray(j.lines) && j.lines.length) return j;
        last = 'ai_empty';
      } catch (e) { last = 'ai_bad_output'; }
    }
    return { error: last };
  };
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(c) {
      c.enqueue(enc.encode(' '));
      const beat = setInterval(() => { try { c.enqueue(enc.encode(' ')); } catch (e) {} }, 4000);
      let out;
      try { out = await run(); } catch (e) { out = { error: 'ai_failed' }; }
      clearInterval(beat);
      c.enqueue(enc.encode(JSON.stringify(out)));
      c.close();
    }
  });
  return new Response(stream, { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
