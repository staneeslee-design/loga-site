// Generated from the design. Page logic: state, handlers and values for the template.
/* eslint-disable */
export default function factory(DCLogic) {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { tab: 'p' };
  }
  componentDidMountPage() {
    var t = '';
    try { var h = (location.hash || '').replace('#', ''); if (h === 'slapukai') t = 's'; if (h === 'privatumas') t = 'p'; } catch (e) {}
    try { var l = localStorage.getItem('logaLegal'); if (!t && l) t = l; localStorage.removeItem('logaLegal'); } catch (e) {}
    if (t) this.setState({ tab: t });
  }
  rgba(hex, a) {
    var h = String(hex || '#E31F25').replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16); if (isNaN(n)) n = 0xE31F25;
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
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
    var LS = {"kCta": "Rasti detalę", "kLang": "Kalba", "kOpenMenu": "Atidaryti meniu", "kMenu": "Meniu", "kClose": "Uždaryti", "kLangPick": "Pasirinkite kalbą", "kHours": "I–V 08:00–18:00 · VI 09:00–14:00", "k7": "Ardomi automobiliai", "k8": "Varikliai", "k9": "DUK", "k10": "Kontaktai", "k11": "Loga group — į pradžią", "k12": "Logagroup — naudotos automobilių dalys", "k13": "Pagrindinis meniu", "k14": "Pradžia", "k15": "Privatumo politika", "k16": "Slapukai", "k17": "Keisti slapukų nustatymus", "k18": "Slapukų nustatymai", "k19": "Klausimai dėl duomenų?", "k20": "Parašyti", "k21": "Originalios naudotos automobilių dalys ir varikliai Vilniuje. Pristatymas Lietuvoje ir Europoje.", "k22": "Darbo laikas", "k23": "I–V · 08:00–18:00", "k24": "VI · 09:00–14:00", "k25": "Puslapis", "k26": "Parduoti automobilį", "k27": "Dažni klausimai", "k28": "Naršymo kelias", "k29": "Dokumentai", "k30": "Mes naudojame slapukus", "k31": "Būtini slapukai užtikrina svetainės veikimą. Analitinius ir rinkodaros slapukus naudosime tik jums sutikus.", "k32": "Sužinoti daugiau", "k33": "Būtini", "k34": "Kalba ir slapukų pasirinkimas", "k35": "Visada įjungta", "k36": "Analitiniai", "k37": "Lankomumo statistika svetainei tobulinti", "k38": "Rinkodaros", "k39": "Aktualūs pasiūlymai kitose svetainėse", "k40": "Tik būtini", "k41": "Sutinku", "k42": "Išsaugoti pasirinkimą", "k43": "Nustatymai"}; var L = {};
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
    var self = this; var s = this.state; var A = this.props.accent || '#E31F25'; var lang = this.langNow ? this.langNow() : 'lt';
    var p = s.tab !== 's';
    return {
      accent: A, accentShadow: this.rgba(A, 0.32),
      isLT: lang === 'lt', isEN: lang === 'en', isRU: lang === 'ru',
      isP: p, isS: !p, crumb: p ? 'Privatumo politika' : 'Slapukai',
      selP: p ? 'true' : 'false', selS: p ? 'false' : 'true',
      bgP: p ? '#ffffff' : 'transparent', bgS: p ? 'transparent' : '#ffffff',
      shP: p ? '0 1px 3px rgba(0,0,0,0.12)' : 'none', shS: p ? 'none' : '0 1px 3px rgba(0,0,0,0.12)',
      secs: ((this.props.legal || {})[p ? 'privacy' : 'cookies'] || []).map(function (x, i) { return { n: i + 1, h: x.title, p: x.body }; }),
      updated: (this.props.legal || {}).updated || '',
      pickP: function () { self.setState({ tab: 'p' }); }, pickS: function () { self.setState({ tab: 's' }); }
    };
  }
}
  return Component;
}
