export const config = { runtime: 'edge' };
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const UA = 'StudioMediaSearch/1.0 (stock search for an Instagram content tool)';
// Hosts /api/proxy may fetch from. Free-gallery items on any other host are dropped.
const SAFE = ['pexels.com', 'pixabay.com', 'wikimedia.org', 'openverse.org', 'staticflickr.com'];
const safe = (s) => { try { const h = new URL(s).hostname; return SAFE.some(o => h === o || h.endsWith('.' + o)); } catch (e) { return false; } };
const short = (l, v) => (l === 'cc0' || l === 'pdm') ? 'Public domain' : 'CC ' + String(l || '').toUpperCase() + (v ? ' ' + v : '');

/* Keyed gallery: Pexels, or Pixabay when the key looks like a Pixabay key. */
async function keyed(key, q, type, page) {
  if (/^\d+-[0-9a-f]{16,}$/i.test(key.trim())) {
    const pu = (type === 'video' ? 'https://pixabay.com/api/videos/' : 'https://pixabay.com/api/') + `?key=${encodeURIComponent(key.trim())}&q=${encodeURIComponent(q)}&per_page=24&page=${page}&safesearch=true` + (type === 'photo' ? '&image_type=photo&orientation=vertical' : '');
    let pr;
    try { pr = await fetch(pu); } catch (e) { return { error: 'pexels_unreachable' }; }
    if (pr.status === 400 || pr.status === 401 || pr.status === 403) return { error: 'bad_pexels_key', fatal: true };
    if (!pr.ok) return { error: 'pexels_' + pr.status };
    const hits = (await pr.json()).hits || [];
    if (type === 'photo') return { items: hits.map(p => ({ id: 'p' + p.id, type: 'photo', thumb: p.webformatURL || p.previewURL, src: p.largeImageURL || p.webformatURL, credit: p.user || '' })) };
    const vids = hits.map(v => {
      const f = v.videos || {};
      const c = [f.medium, f.small, f.large, f.tiny].filter(x => x && x.url);
      if (!c.length) return null;
      const pick = c.find(x => !x.size || x.size < 25000000) || c[c.length - 1];
      return { id: 'v' + v.id, type: 'video', thumb: (f.tiny && f.tiny.thumbnail) || (f.medium && f.medium.thumbnail) || '', src: pick.url, dur: v.duration, credit: v.user || '', tall: pick.height > pick.width ? 1 : 0 };
    }).filter(Boolean).sort((a, b) => b.tall - a.tall);
    return { items: vids };
  }
  const base = type === 'video' ? 'https://api.pexels.com/videos/search' : 'https://api.pexels.com/v1/search';
  let r;
  try { r = await fetch(`${base}?query=${encodeURIComponent(q)}&orientation=portrait&per_page=18&page=${page}`, { headers: { Authorization: key } }); } catch (e) { return { error: 'pexels_unreachable' }; }
  if (r.status === 401 || r.status === 403) return { error: 'bad_pexels_key', fatal: true };
  if (!r.ok) return { error: 'pexels_' + r.status };
  const d = await r.json();
  if (type === 'photo') return { items: (d.photos || []).map(p => ({ id: 'p' + p.id, type: 'photo', thumb: p.src.medium, src: p.src.original + '?auto=compress&cs=tinysrgb&fit=crop&w=1080&h=1920', credit: p.photographer || '' })) };
  return {
    items: (d.videos || []).map(v => {
      const files = (v.video_files || []).filter(f => f.link && (f.file_type || '').includes('mp4') && f.height);
      if (!files.length) return null;
      const score = f => Math.abs(Math.max(f.height, f.width) - 1280) + (f.height >= f.width ? 0 : 400);
      files.sort((a, b) => score(a) - score(b));
      return { id: 'v' + v.id, type: 'video', thumb: v.image, src: files[0].link, dur: v.duration, credit: (v.user && v.user.name) || '' };
    }).filter(Boolean)
  };
}

/* Openverse: ~800M openly licensed images (Flickr, Wikimedia, museums). No key. Only licenses that allow
   commercial use and editing; the credit carries the author and license for the caption. */
async function openverse(q, page) {
  const u = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page=${page}&page_size=20&license_type=commercial,modification&aspect_ratio=tall&mature=false`;
  const r = await fetch(u, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error('openverse_' + r.status);
  return ((await r.json()).results || []).filter(x => safe(x.url)).map(x => ({
    id: 'o' + x.id, type: 'photo', thumb: x.thumbnail || x.url, src: x.url,
    credit: (x.creator || x.source || 'Openverse') + ' · ' + short(x.license, x.license_version), via: 'Openverse'
  }));
}

/* Wikimedia Commons: every file is free to reuse commercially and edit. No key. Images come at 1080 px. */
async function commons(q, page) {
  const off = (page - 1) * 12;
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=12'
    + `&gsroffset=${off}&gsrsearch=${encodeURIComponent('filetype:bitmap ' + q)}&prop=imageinfo&iiprop=url|user|extmetadata&iiurlwidth=1080&iiextmetadatafilter=LicenseShortName`;
  const r = await fetch(u, { headers: { 'user-agent': UA, 'api-user-agent': UA }, signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error('commons_' + r.status);
  const pages = Object.values(((await r.json()).query || {}).pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
  return pages.map(p => {
    const i = (p.imageinfo || [])[0];
    if (!i || !safe(i.thumburl || i.url)) return null;
    const lic = ((i.extmetadata || {}).LicenseShortName || {}).value || 'Wikimedia Commons';
    return { id: 'w' + p.pageid, type: 'photo', thumb: i.thumburl || i.url, src: i.thumburl || i.url, credit: (i.user || 'Wikimedia') + ' · ' + lic, via: 'Wikimedia' };
  }).filter(Boolean);
}

export default async function handler(req) {
  const u = new URL(req.url);
  const key = req.headers.get('x-pexels-key') || process.env.PEXELS_API_KEY || '';
  const q = (u.searchParams.get('q') || 'marble statue').slice(0, 100);
  const type = u.searchParams.get('type') === 'video' ? 'video' : 'photo';
  const page = Math.max(1, parseInt(u.searchParams.get('page') || '1', 10) || 1);
  // Videos still need the Pexels / Pixabay key; photos also search the free galleries.
  if (!key && type === 'video') return json({ error: 'no_pexels_key' }, 401);
  const [k, o, w] = await Promise.allSettled([
    key ? keyed(key, q, type, page) : Promise.resolve({ items: [] }),
    type === 'photo' ? openverse(q, page) : Promise.resolve([]),
    type === 'photo' ? commons(q, page) : Promise.resolve([]),
  ]);
  const main = k.status === 'fulfilled' ? k.value : { error: 'pexels_unreachable' };
  if (main.fatal) return json({ error: main.error }, 401);
  const free = [o, w].flatMap(x => x.status === 'fulfilled' ? x.value : []);
  const items = [...(main.items || []), ...free];
  if (!items.length && main.error) return json({ error: main.error }, 502);
  if (!items.length && !key && type === 'photo' && [o, w].every(x => x.status === 'rejected')) return json({ error: 'no_pexels_key' }, 401);
  return json({ items });
}
