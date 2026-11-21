export const config = { runtime: 'edge' };
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
export default async function handler(req) {
  const u = new URL(req.url);
  const key = req.headers.get('x-pexels-key') || process.env.PEXELS_API_KEY;
  if (!key) return json({ error: 'no_pexels_key' }, 401);
  const q = (u.searchParams.get('q') || 'marble statue').slice(0, 100);
  const type = u.searchParams.get('type') === 'video' ? 'video' : 'photo';
  const page = Math.max(1, parseInt(u.searchParams.get('page') || '1', 10) || 1);
  if (/^\d+-[0-9a-f]{16,}$/i.test(key.trim())) {
    const pu = (type === 'video' ? 'https://pixabay.com/api/videos/' : 'https://pixabay.com/api/') + `?key=${encodeURIComponent(key.trim())}&q=${encodeURIComponent(q)}&per_page=24&page=${page}&safesearch=true` + (type === 'photo' ? '&image_type=photo&orientation=vertical' : '');
    let pr;
    try { pr = await fetch(pu); } catch (e) { return json({ error: 'pexels_unreachable' }, 502); }
    if (pr.status === 400 || pr.status === 401 || pr.status === 403) return json({ error: 'bad_pexels_key' }, 401);
    if (!pr.ok) return json({ error: 'pexels_' + pr.status }, 502);
    const pd = await pr.json();
    const hits = pd.hits || [];
    if (type === 'photo') return json({ items: hits.map(p => ({ id: 'p' + p.id, type: 'photo', thumb: p.webformatURL || p.previewURL, src: p.largeImageURL || p.webformatURL, credit: p.user || '' })) });
    const vids = hits.map(v => {
      const f = v.videos || {};
      const c = [f.medium, f.small, f.large, f.tiny].filter(x => x && x.url);
      if (!c.length) return null;
      const pick = c.find(x => !x.size || x.size < 25000000) || c[c.length - 1];
      return { id: 'v' + v.id, type: 'video', thumb: (f.tiny && f.tiny.thumbnail) || (f.medium && f.medium.thumbnail) || '', src: pick.url, dur: v.duration, credit: v.user || '', tall: pick.height > pick.width ? 1 : 0 };
    }).filter(Boolean).sort((a, b) => b.tall - a.tall);
    return json({ items: vids });
  }
  const base = type === 'video' ? 'https://api.pexels.com/videos/search' : 'https://api.pexels.com/v1/search';
  const url = `${base}?query=${encodeURIComponent(q)}&orientation=portrait&per_page=18&page=${page}`;
  let r;
  try { r = await fetch(url, { headers: { Authorization: key } }); } catch (e) { return json({ error: 'pexels_unreachable' }, 502); }
  if (r.status === 401 || r.status === 403) return json({ error: 'bad_pexels_key' }, 401);
  if (!r.ok) return json({ error: 'pexels_' + r.status }, 502);
  const d = await r.json();
  let items = [];
  if (type === 'photo') {
    items = (d.photos || []).map(p => ({
      id: 'p' + p.id, type: 'photo', thumb: p.src.medium,
      src: p.src.original + '?auto=compress&cs=tinysrgb&fit=crop&w=1080&h=1920',
      credit: p.photographer || ''
    }));
  } else {
    items = (d.videos || []).map(v => {
      const files = (v.video_files || []).filter(f => f.link && (f.file_type || '').includes('mp4') && f.height);
      if (!files.length) return null;
      const score = f => Math.abs(Math.max(f.height, f.width) - 1280) + (f.height >= f.width ? 0 : 400);
      files.sort((a, b) => score(a) - score(b));
      return { id: 'v' + v.id, type: 'video', thumb: v.image, src: files[0].link, dur: v.duration, credit: (v.user && v.user.name) || '' };
    }).filter(Boolean);
  }
  return json({ items });
}
