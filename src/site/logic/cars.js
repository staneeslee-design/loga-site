// Generated from the design. Page logic: state, handlers and values for the template.
/* eslint-disable */
export default function factory(DCLogic) {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { view: props.selId ? 'detail' : 'list', sel: props.selId || null, idx: 0, q: '', make: '', sort: 'new', copied: false, sheet: false };
  }
  componentDidMountPage() {}

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
    var LS = {"kCta": "Rasti detalę", "kLang": "Kalba", "kOpenMenu": "Atidaryti meniu", "kMenu": "Meniu", "kClose": "Uždaryti", "kLangPick": "Pasirinkite kalbą", "kHours": "I–V 08:00–18:00 · VI 09:00–14:00", "k7": "Ardomi automobiliai", "k8": "Varikliai", "k9": "DUK", "k10": "Kontaktai", "k11": "Loga group — į pradžią", "k12": "Logagroup — naudotos automobilių dalys", "k13": "Pagrindinis meniu", "k14": "Pradžia", "k15": "Automobiliai dalimis", "k16": "Originalios naudotos dalys iš ardomų donorų Vilniuje. Pasirinkite automobilį — pamatysite nuotraukas ir duomenis.", "k17": "Naršymo kelias", "k18": "Rikiuoti", "k19": "Naujausi metai", "k20": "Seniausi metai", "k21": "Pagal pavadinimą", "k22": "Paieška", "k23": "Ieškoti: BMW X5, Mustang, VIN…", "k24": "Markės", "k25": "Rasta:", "k26": "nuotr.", "k27": "Peržiūrėti automobilį", "k28": "— plačiau", "k29": "Užklausa →", "k30": "Nieko neradome", "k31": "Pabandykite kitą paiešką arba paskambinkite — patikrinsime sandėlyje.", "k32": "Rodyti viską", "k33": "← Visi automobiliai", "k34": "Automobilis dalimis ·", "k35": "Ankstesnė nuotrauka", "k36": "Kita nuotrauka", "k37": "Aprašymas", "k38": "Automobilio duomenys", "k39": "VIN kodas", "k40": "Domina dalis iš šio automobilio?", "k41": "Paskambinkite arba parašykite — pasakysime, ar turime, ir atsiųsime nuotraukas.", "k42": "Rodyti nuotrauką", "k43": "I–V 08:00–18:00 · VI 09:00–14:00 · Fabriko g. 12, Lentvaris", "k44": "Taip pat ardomi", "k45": "Panašūs automobiliai", "k46": "Visi automobiliai →", "k47": "Originalios naudotos automobilių dalys ir varikliai Vilniuje. Pristatymas Lietuvoje ir Europoje.", "k48": "Darbo laikas", "k49": "I–V · 08:00–18:00", "k50": "VI · 09:00–14:00", "k51": "Puslapis", "k52": "Parduoti automobilį", "k53": "Dažni klausimai", "k54": "Privatumo politika", "k55": "Slapukai", "k56": "Užklausa", "k57": "Greita užklausa", "k58": "Kokia detalė?", "k59": "Telefonas", "k60": "Įrašykite telefono numerį.", "k61": "Siųsti užklausą →", "k62": "Arba skambinkite", "k63": "pvz. galinis dangtis", "k64": "Užklausa išsiųsta", "k65": "Patikrinsime, ar dalis yra, ir paskambinsime.", "k66": "Mes naudojame slapukus", "k67": "Būtini slapukai užtikrina svetainės veikimą. Analitinius ir rinkodaros slapukus naudosime tik jums sutikus.", "k68": "Sužinoti daugiau", "k69": "Būtini", "k70": "Kalba ir slapukų pasirinkimas", "k71": "Visada įjungta", "k72": "Analitiniai", "k73": "Lankomumo statistika svetainei tobulinti", "k74": "Rinkodaros", "k75": "Aktualūs pasiūlymai kitose svetainėse", "k76": "Tik būtini", "k77": "Sutinku", "k78": "Išsaugoti pasirinkimą", "k79": "Nustatymai"}; var L = {};
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
    var VER = function (v) { return v === 'EU' ? { ver: 'EU Version', hasVer: true, verBg: '#1d4ed8', verDot: '#facc15' } : v === 'US' ? { ver: 'US Version', hasVer: true, verBg: '#2a2a2d', verDot: '#ef4444' } : { ver: '', hasVer: false, verBg: '', verDot: '' }; };
    var open = function (c) { return function () { window.location.href = (self.props.base || '') + '/automobiliai/' + c.slug; }; };
    var q = this.norm(s.q.trim());
    var list = all.filter(function (c) {
      if (s.make && c.make !== s.make) return false;
      if (q && self.norm([c.t, c.y, c.eng, c.body, c.fuel, c.vin].join(' ')).indexOf(q) < 0) return false;
      return true;
    }).slice();
    list.sort(function (a, b) {
      if (s.sort === 'az') return a.t.localeCompare(b.t);
      var ya = +a.y || 0, yb = +b.y || 0;
      return s.sort === 'old' ? ya - yb : (yb - ya || (b.tag ? 1 : 0) - (a.tag ? 1 : 0));
    });
    var card = function (c) {
      var chips = [c.y, c.eng, c.fuel, c.gear].filter(Boolean).slice(0, 4);
      return Object.assign(VER(c.market), { t: c.t, sub: [c.body, c.make].filter(Boolean).join(' · '), cover: c.cover, pc: c.pc, tag: c.tag, hasTag: !!c.tag, chips: chips, open: open(c), ask: function () { self.setState({ askCar: c.t, askPart: '', askSent: false, askErr: false }); } });
    };
    var cur = all.filter(function (c) { return c.id === s.sel; })[0] || all[0];
    var g = this.gallery(cur); this._g = g;
    var specRows = [['Metai', cur.y], ['Variklis', cur.eng], ['Kuras', cur.fuel], ['Pavarų dėžė', cur.gear], ['Kėbulas', cur.body], ['Rida', cur.km], ['Spalva', cur.color], ['Varomieji ratai', cur.drive], ['Kilmė', cur.origin], ['Versija', cur.market === 'EU' ? 'EU Version' : cur.market === 'US' ? 'US Version' : ''], ['Statusas', cur.tag || 'Ardomas']]
      .filter(function (r) { return r[1]; }).map(function (r) { return { k: r[0], v: r[1] }; });
    var facts = [{ k: 'Metai', v: cur.y || '—' }, { k: 'Kuras', v: cur.fuel || '—' }, { k: 'Rida', v: cur.km || '—' }];
    var sim = all.filter(function (c) { return c.id !== cur.id && c.make === cur.make; });
    if (sim.length < 3) sim = sim.concat(all.filter(function (c) { return c.id !== cur.id && c.make !== cur.make; }));
    return Object.assign(this.sortVals([['new', 'Naujausi metai'], ['old', 'Seniausi metai'], ['az', 'Pagal pavadinimą']]), {
      accent: A, accentShadow: this.rgba(A, 0.32),
      isList: s.view === 'list', isDetail: s.view === 'detail',
      total: all.length, q: s.q, setQ: function (e) { self.setState({ q: e.target.value }); },
      sort: s.sort, setSort: function (e) { self.setState({ sort: e.target.value }); },
      makes: this.makesFor(all, s.make),
      found: list.length,
      items: list.map(card), none: list.length === 0,
      clearF: function () { self.setState({ q: '', make: '' }); },
      d: Object.assign(VER(cur.market), { title: cur.t, make: cur.make, tag: cur.tag, hasTag: !!cur.tag, desc: cur.desc || 'Dėl dalių skambinkite +370 641 23788.', specs: specRows, facts: facts, vin: cur.vin, hasVin: !!cur.vin }, g),
      prev: g.prev, next: g.next,
      askOpen: !!s.askCar, askCar: s.askCar || '', askPart: s.askPart || '', askPhone: s.askPhone || '', askErr: !!s.askErr, askSent: !!s.askSent, askNotSent: !s.askSent,
      setAskPart: function (e) { self.setState({ askPart: e.target.value }); }, setAskPhone: function (e) { self.setState({ askPhone: e.target.value, askErr: false }); },
      closeAsk: function () { self.setState({ askCar: '' }); },
      sendAsk: function () { if (!String(s.askPhone || '').trim()) { self.setState({ askErr: true }); return; } self.submit('quick', { subject: s.askCar, part: s.askPart, phone: s.askPhone }, function (e) { if (e) { self.setState({ askErr: true }); return; } self.setState({ askSent: true }); }); },
      lb: !!s.lb, openLb: function () { self.lbOpen(); }, closeLb: function () { self.lbClose(); },
      tStart: function (e) { try { self._tx = e.touches[0].clientX; } catch (x) {} },
      tEnd: function (e) { try { var dx = e.changedTouches[0].clientX - (self._tx || 0); if (dx > 40) g.prev(); else if (dx < -40) g.next(); } catch (x) {} },
      similar: sim.slice(0, 3).map(card),
      back: function () { window.location.href = (self.props.base || '') + '/automobiliai'; },
      copyLabel: s.copied ? 'Nukopijuota' : 'Kopijuoti', copyBg: s.copied ? A : 'rgba(255,255,255,0.14)',
      copyVin: function () { try { navigator.clipboard.writeText(cur.vin); } catch (e) {} self.setState({ copied: true }); setTimeout(function () { self.setState({ copied: false }); }, 1600); }
    });
  }
}
  return Component;
}
