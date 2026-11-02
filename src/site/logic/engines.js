// Generated from the design. Page logic: state, handlers and values for the template.
/* eslint-disable */
export default function factory(DCLogic) {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { view: props.selId ? 'detail' : 'list', sel: props.selId || null, idx: 0, q: '', make: '', sort: 'pa', sheet: false };
  }
  rgba(hex, a) {
    var h = String(hex || '#E31F25').replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16); if (isNaN(n)) n = 0xE31F25;
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  norm(t) {
    var m = { 'ą': 'a', 'č': 'c', 'ę': 'e', 'ė': 'e', 'į': 'i', 'š': 's', 'ų': 'u', 'ū': 'u', 'ž': 'z', 'ë': 'e' };
    return String(t || '').toLowerCase().replace(/[ąčęėįšųūžë]/g, function (c) { return m[c]; });
  }
  top() { try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {} }
  makesFor(list, cur) {
    var self = this; var A = this.props.accent || '#E31F25'; var cnt = {};
    list.forEach(function (x) { cnt[x.make] = (cnt[x.make] || 0) + 1; });
    var keys = Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a] || a.localeCompare(b); });
    return [['', 'Visi', list.length]].concat(keys.map(function (k) { return [k, k, cnt[k]]; })).map(function (m) {
      var on = cur === m[0];
      return { label: m[1], n: m[2], nbg: on ? A : '#f1f1f3', nfg: on ? '#ffffff' : '#4f5054', sel: on ? 'true' : 'false', bg: on ? '#2a2a2d' : '#ffffff', fg: on ? '#ffffff' : '#2a2a2d', bd: on ? '#2a2a2d' : '#e2e2e4', pick: function () { self.setState({ make: m[0] }); } };
    });
  }
  sortVals(opts) {
    var self = this; var s = this.state; var A = this.props.accent || '#E31F25';
    var cur = opts.filter(function (o) { return o[0] === s.sort; })[0] || opts[0];
    return {
      sheet: !!s.sheet, sortLabel: cur[1],
      openSheet: function () { self.setState({ sheet: true }); },
      closeSheet: function () { self.setState({ sheet: false }); },
      stop: function (e) { e.stopPropagation(); },
      sortOpts: opts.map(function (o) { var on = o[0] === s.sort; return { label: o[1], sel: on ? 'true' : 'false', bg: on ? self.rgba(A, 0.07) : '#ffffff', fw: on ? '700' : '500', ring: on ? A : '#d4d4d8', dot: on ? A : '#ffffff', pick: function () { self.setState({ sort: o[0], sheet: false }); } }; })
    };
  }
  lbOpen() {
    var self = this; this.setState({ lb: true });
    try { document.documentElement.style.overflow = 'hidden'; } catch (e) {}
    if (!this._kb) {
      this._kb = function (e) {
        if (!self.state.lb) return;
        if (e.key === 'Escape') self.lbClose();
        else if (e.key === 'ArrowLeft' && self._g) self._g.prev();
        else if (e.key === 'ArrowRight' && self._g) self._g.next();
      };
      try { window.addEventListener('keydown', this._kb); } catch (e) {}
    }
  }
  lbClose() {
    this.setState({ lb: false });
    try { document.documentElement.style.overflow = ''; } catch (e) {}
  }
  gallery(item) {
    var self = this; var s = this.state; var A = this.props.accent || '#E31F25';
    var ph = item.photos || []; var n = Math.max(1, ph.length); var idx = Math.min(s.idx, n - 1);
    var p = ph[idx] || {};
    var th = ph.map(function (x, i) { var on = i === idx; return { n: i + 1, src: x.t, sel: on ? 'true' : 'false', op: on ? '1' : '0.55', ring: on ? '0 0 0 3px ' + A : 'none', pick: function () { self.setState({ idx: i }); } }; });
    return {
      cur: p.m || p.l || '', big: p.l || p.m || '', no: idx + 1, pc: ph.length, prog: ((idx + 1) * 100 / n).toFixed(2) + '%',
      thumbs: th,
      prev: function () { self.setState({ idx: (idx + n - 1) % n }); },
      next: function () { self.setState({ idx: (idx + 1) % n }); }
    };
  }


  data() {
    var D = this.dict(this.langNow()); var raw = this.rawData();
    if (!D) return raw;
    if (this._dl === this.langNow() && this._dc) return this._dc;
    var F = ['fuel', 'gear', 'body', 'tag', 'drive', 'origin', 'color', 'war'];
    this._dl = this.langNow(); this._dc = raw.map(function (c) { var o = Object.assign({}, c); F.forEach(function (f) { if (o[f] && D.hasOwnProperty(o[f])) o[f] = D[o[f]]; }); return o; });
    return this._dc;
  }
  rawData() { return this.props.items || []; }
  langNow() { return this.props.locale || 'lt'; }
  dict(lang) { return this.props.dict || null; }
  trv(x, D) {
    var self = this;
    if (!D) return x;
    if (typeof x === 'string') return D.hasOwnProperty(x) ? D[x] : x;
    if (Array.isArray(x)) return x.map(function (y) { return self.trv(y, D); });
    if (x && typeof x === 'object' && Object.getPrototypeOf(x) === Object.prototype) { var o = {}; for (var k in x) o[k] = self.trv(x[k], D); return o; }
    return x;
  }
  submit(type, payload, done) {
    var self = this;
    var body = Object.assign({ type: type, locale: this.props.locale, page: (typeof location !== 'undefined' ? location.pathname : '') }, payload);
    fetch('/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) { if (!res.ok) throw new Error((res.j && res.j.error) || 'error'); done(null); })
      .catch(function (e) { done(e); });
  }
  componentDidMount() {
    var self = this;
    this._hs = function () {
      var y = 0; try { y = window.scrollY || 0; } catch (e) {}
      var last = self._ly || 0, dy = y - last; self._ly = y;
      var on = y > 24, hd = !!self.state.hd;
      if (y < 160) hd = false; else if (dy > 6) hd = true; else if (dy < -6) hd = false;
      if (on !== !!self.state.hs || hd !== !!self.state.hd) self.setState({ hs: on, hd: hd });
    };
    try { window.addEventListener('scroll', this._hs, { passive: true }); } catch (e) {}
    var ck0 = null; try { ck0 = JSON.parse(localStorage.getItem('logaCookies') || 'null'); } catch (e) {} this.setState({ ck: ck0 });
    if (this.componentDidMountPage) this.componentDidMountPage();
  }
  componentWillUnmount() { try { window.removeEventListener('scroll', this._hs); } catch (e) {} }
  renderVals() {
    var self = this; var lang = this.langNow(); var D = this.dict(lang);
    this._D = D;
    var v = this.trv(this.renderValsLT(), D);
    var LS = {"kCta": "Rasti detalę", "kLang": "Kalba", "kOpenMenu": "Atidaryti meniu", "kMenu": "Meniu", "kClose": "Uždaryti", "kLangPick": "Pasirinkite kalbą", "kHours": "I–V 08:00–18:00 · VI 09:00–14:00", "k7": "Ardomi automobiliai", "k8": "Varikliai", "k9": "DUK", "k10": "Kontaktai", "k11": "Loga group — į pradžią", "k12": "Logagroup — naudotos automobilių dalys", "k13": "Pagrindinis meniu", "k14": "Pradžia", "k15": "Naudoti varikliai", "k16": "Patikrinti varikliai", "k17": "Patikrinti varikliai su garantija. Siunčiame visoje Lietuvoje ir Europoje.", "k18": "Naršymo kelias", "k19": "Rikiuoti", "k20": "Kaina: nuo mažiausios", "k21": "Kaina: nuo didžiausios", "k22": "Pagal kodą", "k23": "Paieška", "k24": "Ieškoti: B58, N63, Golf, Outback…", "k25": "Markės", "k26": "Rasta:", "k27": "Sandėlyje", "k28": "Variklio kodas", "k29": "Variklis", "k30": "Garantija", "k31": "Nieko neradome", "k32": "Pabandykite kitą paiešką arba paskambinkite — patikrinsime sandėlyje.", "k33": "Rodyti viską", "k34": "← Visi varikliai", "k35": "Naudotas variklis ·", "k36": "Ankstesnė nuotrauka", "k37": "Kita nuotrauka", "k38": "Apie variklį", "k39": "nuimtas nuo", "k40": ". Prieš išsiunčiant patikriname būklę ir suderiname su jūsų automobiliu pagal VIN. Daugiau informacijos apie būklę, suderinamumą ir pristatymą suteiksime telefonu.", "k41": "Rodyti nuotrauką", "k42": "Suderiname pagal VIN", "k43": "Siuntimas LT ir ES", "k44": "Kaina", "k45": "Norite užsisakyti šį variklį?", "k46": "Paskambinkite — patikrinsime suderinamumą ir suderinsime pristatymą.", "k47": "I–V 08:00–18:00 · VI 09:00–14:00 · Fabriko g. 12, Lentvaris", "k48": "Taip pat sandėlyje", "k49": "Panašūs varikliai", "k50": "Visi varikliai →", "k51": "Originalios naudotos automobilių dalys ir varikliai Vilniuje. Pristatymas Lietuvoje ir Europoje.", "k52": "Darbo laikas", "k53": "I–V · 08:00–18:00", "k54": "VI · 09:00–14:00", "k55": "Puslapis", "k56": "Parduoti automobilį", "k57": "Dažni klausimai", "k58": "Privatumo politika", "k59": "Slapukai", "k60": "Mes naudojame slapukus", "k61": "Būtini slapukai užtikrina svetainės veikimą. Analitinius ir rinkodaros slapukus naudosime tik jums sutikus.", "k62": "Sužinoti daugiau", "k63": "Būtini", "k64": "Kalba ir slapukų pasirinkimas", "k65": "Visada įjungta", "k66": "Analitiniai", "k67": "Lankomumo statistika svetainei tobulinti", "k68": "Rinkodaros", "k69": "Aktualūs pasiūlymai kitose svetainėse", "k70": "Tik būtini", "k71": "Sutinku", "k72": "Išsaugoti pasirinkimą", "k73": "Nustatymai"}; var L = {};
    for (var k in LS) L[k] = D && D.hasOwnProperty(LS[k]) ? D[LS[k]] : LS[k];
    v.L = L; v.S = this.props.settings || {}; v.base = this.props.base || ''; v.home = this.props.base || '/';
    var A = this.props.accent || '#E31F25';
    v.langs = [['lt', 'LT', 'Lietuvių'], ['en', 'EN', 'English'], ['ru', 'RU', 'Русский']].map(function (p) {
      var on = p[0] === lang;
      return { label: p[1], name: p[2], isLT: p[0] === 'lt', isEN: p[0] === 'en', isRU: p[0] === 'ru', sel: on ? 'true' : 'false', bg: on ? '#f7f7f8' : 'transparent', fw: on ? '700' : '500', chk: on ? '1' : '0', mbg: on ? '#ffffff' : '#f7f7f8', mbd: on ? A : '#f7f7f8', pick: function () { var u = self.props.langUrls || {}; window.location.href = u[p[0]] || '/'; } };
    });
    v.cur = v.langs.filter(function (x) { return x.sel === 'true'; })[0];
    v.ddOpen = !!this.state.dd; v.ddExp = this.state.dd ? 'true' : 'false'; v.ddRot = this.state.dd ? '180deg' : '0deg';
    v.toggleDd = function () { self.setState({ dd: !self.state.dd }); };
    v.closeDd = function () { self.setState({ dd: false }); };
    v.mmOpen = !!this.state.mm; v.mmExp = this.state.mm ? 'true' : 'false';
    v.openMm = function () { self.setState({ mm: true, dd: false }); };
    v.toggleMm = function () { self.setState({ mm: !self.state.mm, dd: false }); };
    v.mmClosed = !this.state.mm;
    v.hdrCls = (false && !this.state.hs && !this.state.mm) ? 'hdr-clear' : '';
    var hold = this.state.mm || this.state.dd;
    v.hdrFade = 'hdr-wrap' + (this.state.hd && !hold ? ' hdr-hide' : '');
    var pagePart = v.openPart;
    v.ctaPart = function (e) { self.setState({ mm: false }); if (pagePart) { try { e.preventDefault(); } catch (x) {} pagePart(); } };
    v.closeMm = function () { self.setState({ mm: false }); };
    v.stopMm = function (e) { e.stopPropagation(); };
    var ck = this.state.ck; var ckPending = ck === undefined; if (ckPending) ck = null;
    var ckDraft = this.state.ckDraft || { a: !!(ck && ck.a), m: !!(ck && ck.m) };
    var saveCk = function (a, m) { var val = { n: true, a: a, m: m, t: Date.now() }; try { localStorage.setItem('logaCookies', JSON.stringify(val)); } catch (e) {} self.setState({ ck: val, ckOpen: false, ckMoreOpen: false, ckDraft: null }); };
    v.ckShow = !ckPending && (!ck || !!this.state.ckOpen); v.ckMore = !!this.state.ckMoreOpen; v.ckLess = !this.state.ckMoreOpen;
    v.ckA = ckDraft.a ? 'true' : 'false'; v.ckABg = ckDraft.a ? A : '#d4d4d8'; v.ckAX = ckDraft.a ? '20px' : '0px';
    v.ckM = ckDraft.m ? 'true' : 'false'; v.ckMBg = ckDraft.m ? A : '#d4d4d8'; v.ckMX = ckDraft.m ? '20px' : '0px';
    v.toggleA = function () { self.setState({ ckDraft: { a: !ckDraft.a, m: ckDraft.m } }); };
    v.toggleM = function () { self.setState({ ckDraft: { a: ckDraft.a, m: !ckDraft.m } }); };
    v.ckToggleMore = function () { self.setState({ ckMoreOpen: true }); };
    v.ckAll = function () { saveCk(true, true); };
    v.ckNecessary = function () { saveCk(false, false); };
    v.ckSave = function () { saveCk(ckDraft.a, ckDraft.m); };
    v.openCk = function () { self.setState({ ckOpen: true, ckMoreOpen: true }); };
    v.goLegalP = function () { try { localStorage.setItem('logaLegal', 'p'); } catch (e) {} };
    v.goLegalS = function () { try { localStorage.setItem('logaLegal', 's'); } catch (e) {} };
    return v;
  }
  renderValsLT() {
    var self = this; var s = this.state; var A = this.props.accent || '#E31F25';
    var all = this.data();
    var open = function (c) { return function () { window.location.href = (self.props.base || '') + '/varikliai/' + c.slug; }; };
    var q = this.norm(s.q.trim());
    var list = all.filter(function (c) {
      if (s.make && c.make !== s.make) return false;
      if (q && self.norm([c.code, c.fits, c.fuel, c.kw, c.vin].join(' ')).indexOf(q) < 0) return false;
      return true;
    }).slice();
    list.sort(function (a, b) {
      if (s.sort === 'az') return a.code.localeCompare(b.code);
      return s.sort === 'pd' ? b.p - a.p : a.p - b.p;
    });
    var card = function (c) {
      return { code: c.code, fits: c.fits, price: c.price, war: c.war, cover: c.cover, chips: [c.vol, c.fuel, c.kw, c.km].filter(Boolean).slice(0, 4), open: open(c) };
    };
    var cur = all.filter(function (c) { return c.id === s.sel; })[0] || all[0];
    var g = this.gallery(cur); this._g = g;
    var specRows = [['Variklio kodas', cur.code], ['Tinka', cur.fits], ['Tūris', cur.vol], ['Kuras', cur.fuel], ['Galia', cur.kw], ['Rida', cur.km], ['Garantija', cur.war], ['Donoro VIN', cur.vin]]
      .filter(function (r) { return r[1]; }).map(function (r) { return { k: r[0], v: r[1] }; });
    var sim = all.filter(function (c) { return c.id !== cur.id && c.make === cur.make; });
    if (sim.length < 3) sim = sim.concat(all.filter(function (c) { return c.id !== cur.id && c.make !== cur.make; }));
    return Object.assign(this.sortVals([['pa', 'Kaina: nuo mažiausios'], ['pd', 'Kaina: nuo didžiausios'], ['az', 'Pagal kodą']]), {
      accent: A, accentShadow: this.rgba(A, 0.32),
      isList: s.view === 'list', isDetail: s.view === 'detail',
      total: all.length, q: s.q, setQ: function (e) { self.setState({ q: e.target.value }); },
      sort: s.sort, setSort: function (e) { self.setState({ sort: e.target.value }); },
      makes: this.makesFor(all, s.make),
      found: list.length,
      items: list.map(card), none: list.length === 0,
      clearF: function () { self.setState({ q: '', make: '' }); },
      d: Object.assign({ code: cur.code, fits: cur.fits, make: cur.make, price: cur.price, war: cur.war, tag: '', hasTag: false, specs: specRows }, g),
      prev: g.prev, next: g.next,
      lb: !!s.lb, openLb: function () { self.lbOpen(); }, closeLb: function () { self.lbClose(); },
      tStart: function (e) { try { self._tx = e.touches[0].clientX; } catch (x) {} },
      tEnd: function (e) { try { var dx = e.changedTouches[0].clientX - (self._tx || 0); if (dx > 40) g.prev(); else if (dx < -40) g.next(); } catch (x) {} },
      similar: sim.slice(0, 3).map(card),
      back: function () { window.location.href = (self.props.base || '') + '/varikliai'; }
    });
  }
}
  return Component;
}
