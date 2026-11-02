// Generated from the design. Page logic: state, handlers and values for the template.
/* eslint-disable */
export default function factory(DCLogic) {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { tilt: [null, null], pm: false, sm: false,
      tab: 'part', step: 1, sent: false, err: '',
      form: { make: '', model: '', year: '', vin: '', part: '', note: '', delivery: 'Atsiimsiu', name: '', phone: '', channel: 'Skambutis' },
      sell: { model: '', year: '', cond: 'Važiuoja', phone: '' }, sellSent: false, sellErr: false,
      modalCar: '', modalPart: '', modalPhone: '', modalSent: false, modalErr: false,
      cbPhone: '', cbWhat: '', cbSent: false, cbErr: false
    };
  }
  rgba(hex, a) {
    var h = String(hex || '#E31F25').replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    if (isNaN(n)) n = 0xE31F25;
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  setForm(k) { var self = this; return function (e) { var v = e.target.value; self.setState(function (s) { var f = Object.assign({}, s.form); f[k] = v; return { form: f, err: '' }; }); }; }
  setSell(k) { var self = this; return function (e) { var v = e.target.value; self.setState(function (s) { var f = Object.assign({}, s.sell); f[k] = v; return { sell: f, sellErr: false }; }); }; }
  pickForm(k, v) { var self = this; return function () { self.setState(function (s) { var f = Object.assign({}, s.form); f[k] = v; return { form: f }; }); }; }
  chips(list, cur, pick) {
    var A = this.props.accent || '#E31F25'; var self = this;
    return list.map(function (l) {
      var sel = l === cur;
      return { label: l, sel: sel ? 'true' : 'false', pick: pick(l), bg: sel ? self.rgba(A, 0.08) : '#ffffff', bd: sel ? A : '#e2e2e4' };
    });
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
    var LS = {"kCta": "Rasti detalę", "kLang": "Kalba", "kOpenMenu": "Atidaryti meniu", "kMenu": "Meniu", "kClose": "Uždaryti", "kLangPick": "Pasirinkite kalbą", "kHours": "I–V 08:00–18:00 · VI 09:00–14:00", "k7": "Ardomi automobiliai", "k8": "Varikliai", "k9": "DUK", "k10": "Kontaktai", "k11": "Loga group — į pradžią", "k12": "Logagroup — naudotos automobilių dalys", "k13": "Pagrindinis meniu", "k14": "Vilnius · Pristatymas Lietuvoje ir Europoje", "k15": "Naudotos originalios", "k16": "automobilių dalys", "k17": "Tūkstančiai originalių naudotų dalių ir variklių iš ardomų automobilių Vilniuje. Atsiųskite VIN — patikrinsime, ar detalė tinka, ir pasakysime kainą.", "k18": "Kiekvieną dalį patikriname prieš išduodant", "k19": "Suderiname pagal VIN — tiks iš pirmo karto", "k20": "Siunčiame visoje Lietuvoje ir Europoje", "k21": "Pavarų dėžės", "k22": "Kėbulo dalys", "k23": "Žibintai", "k24": "Salono dalys", "k25": "Elektronika", "k26": "Važiuoklė", "k27": "Ratlankiai", "k28": "Turbinos", "k29": "Stabdžių sistema", "k30": "Šiuo metu ardomi", "k31": "Naujai ardomi automobiliai.", "k32": "Pasirinkite automobilį ir užklauskite dalį vienu paspaudimu — atsakysime, ar ji dar yra.", "k33": "Visi ardomi automobiliai →", "k34": "Naujai ardomas", "k35": "— plačiau", "k36": "Užklausa →", "k37": "Kaip užsakyti", "k38": "Nuo užklausos iki detalės — trys žingsniai.", "k39": "Nereikia važiuoti ir ieškoti po aikšteles. Parašykite — detalę surasime, patikrinsime ir paruošime jums.", "k40": "Susisiekite dėl detalės", "k41": "Paskambinkite, parašykite arba susisiekite per Viber ar WhatsApp.", "k42": "Greitas atsakymas", "k43": "Patikriname ir pasiūlome", "k44": "Randame detalę mūsų sandėlyje, patikriname būklę ir suderiname pagal VIN.", "k45": "Lietuva ir Europa", "k46": "Atsiimate arba išsiunčiame", "k47": "Atsiimkite Fabriko g. 12, Lentvaryje, arba siunčiame kurjeriu visoje Lietuvoje ir Europoje.", "k48": "Superkame automobilius", "k49": "Parduokite automobilį be ilgų derybų.", "k50": "Įvertinsime tą pačią darbo dieną. Pasiimame visoje Lietuvoje — važiuojantį, daužtą ar nevažiuojantį.", "k51": "Užklausa su VIN kodu per Viber ar WhatsApp", "k52": "Detalės paieška ir patikra sandėlyje", "k53": "Pristatymas Lietuvoje ir Europoje", "k54": "Automobilio raktų perdavimas prie daužto automobilio", "k55": "Pasiūlymas per 1 darbo dieną", "k56": "Pasiėmimas visoje Lietuvoje", "k57": "Aiški kaina, be spaudimo", "k58": "Pasiūlyti automobilį →", "k59": "Dažnai klausiate.", "k60": "Neradote atsakymo? Paskambinkite — atsakysime per kelias minutes.", "k61": "Ar dalys originalios?", "k62": "Taip. Visos dalys nuimamos nuo ardomų automobilių — tai originalios gamintojo dalys, ne kopijos.", "k63": "Kaip sužinoti, ar detalė tiks mano automobiliui?", "k64": "Atsiųskite VIN kodą. Pagal jį patikriname detalės kodą ir suderiname su donoru prieš išsiunčiant.", "k65": "Ar suteikiate garantiją?", "k66": "Varikliams suteikiame garantiją. Sąlygos: [GARANTIJOS TRUKMĖ IR SĄLYGOS].", "k67": "Ar siunčiate į kitas šalis?", "k68": "Taip, pristatome visoje Lietuvoje ir Europoje. Siuntimo kaina priklauso nuo detalės dydžio ir šalies.", "k69": "Ar galima atsiimti pačiam?", "k70": "Taip — Fabriko g. 12, Lentvaris. Dirbame I–V 08:00–18:00, VI 09:00–14:00.", "k71": "Greitas kontaktas", "k72": "Palikite numerį.", "k73": "Perskambinsime.", "k74": "Telefonas", "k75": "El. paštas", "k76": "Adresas", "k77": "Darbo laikas", "k78": "Užsisakykite skambutį", "k79": "Paskambinsime per darbo valandas.", "k80": "Ko ieškote?", "k81": "Įrašykite telefono numerį.", "k82": "Laukiu skambučio", "k83": "Nemokamai · be įsipareigojimų", "k84": "Automobilis, detalė, VIN…", "k85": "Ačiū! Netrukus paskambinsime", "k86": "Originalios naudotos automobilių dalys ir varikliai Vilniuje. Pristatymas Lietuvoje ir Europoje.", "k87": "I–V · 08:00–18:00", "k88": "VI · 09:00–14:00", "k89": "Puslapis", "k90": "Parduoti automobilį", "k91": "Dažni klausimai", "k92": "Privatumo politika", "k93": "Slapukai", "k94": "Skambinti +370 641 23788", "k95": "Detalės paieška", "k96": "Rasime detalę pagal jūsų VIN", "k97": "Nemokamai ir be įsipareigojimų", "k98": "Suderiname pagal VIN kodą", "k99": "Siunčiame Lietuvoje ir Europoje", "k100": "Arba skambinkite", "k101": "Koks jūsų automobilis?", "k102": "Markė", "k103": "Pasirinkite markę", "k104": "Kita", "k105": "Modelis", "k106": "Metai", "k107": "VIN kodas", "k108": "— neprivaloma, bet tiksliau", "k109": "Kokios detalės reikia?", "k110": "Detalė", "k111": "Komentaras", "k112": "Pristatymas", "k113": "Kaip su jumis susisiekti?", "k114": "Ieškote:", "k115": "Vardas", "k116": "Kaip atsakyti?", "k117": "← Atgal", "k118": "Atsakome darbo valandomis · I–V 08–18, VI 09–14", "k119": "pvz. X5 F15", "k120": "pvz. 2016", "k121": "17 simbolių", "k122": "pvz. priekinis žibintas, variklis", "k123": "Pusė, spalva, OEM kodas…", "k124": "Jūsų vardas", "k125": "Užklausa išsiųsta", "k126": "Patikrinsime sandėlį ir", "k127": "Nauja užklausa", "k128": "Parduokite be ilgų derybų", "k129": "Pasiimame visoje Lietuvoje", "k130": "Važiuojantį, daužtą ar nevažiuojantį", "k131": "Kiek vertas jūsų automobilis?", "k132": "Užpildykite — paskambinsime su pasiūlymu.", "k133": "Markė ir modelis", "k134": "Būklė", "k135": "Įrašykite telefono numerį — paskambinsime su pasiūlymu.", "k136": "Gauti pasiūlymą →", "k137": "pvz. VW Passat", "k138": "pvz. 2012", "k139": "Paraiška išsiųsta", "k140": "Paskambinsime su pasiūlymu per 1 darbo dieną.", "k141": "Nauja paraiška", "k142": "Užklausa", "k143": "Greita užklausa", "k144": "Kokia detalė?", "k145": "Siųsti užklausą →", "k146": "pvz. galinis dangtis", "k147": "Patikrinsime, ar dalis yra, ir paskambinsime.", "k148": "Mes naudojame slapukus", "k149": "Būtini slapukai užtikrina svetainės veikimą. Analitinius ir rinkodaros slapukus naudosime tik jums sutikus.", "k150": "Sužinoti daugiau", "k151": "Būtini", "k152": "Kalba ir slapukų pasirinkimas", "k153": "Visada įjungta", "k154": "Analitiniai", "k155": "Lankomumo statistika svetainei tobulinti", "k156": "Rinkodaros", "k157": "Aktualūs pasiūlymai kitose svetainėse", "k158": "Tik būtini", "k159": "Sutinku", "k160": "Išsaugoti pasirinkimą", "k161": "Nustatymai"}; var L = {};
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
    v.hdrCls = (true && !this.state.hs && !this.state.mm) ? 'hdr-clear' : '';
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
  plural(kind, n) {
    var l = this.props.locale || 'lt'; var m10 = n % 10, m100 = n % 100;
    var F = {
      lt: { cars: ['automobilis', 'automobiliai', 'automobilių'], engines: ['variklis', 'varikliai', 'variklių'] },
      en: { cars: ['car', 'cars', 'cars'], engines: ['engine', 'engines', 'engines'] },
      ru: { cars: ['автомобиль', 'автомобиля', 'автомобилей'], engines: ['двигатель', 'двигателя', 'двигателей'] }
    }[l] || {};
    var f = F[kind] || ['', '', ''];
    var i;
    if (l === 'lt') i = (m10 === 1 && m100 !== 11) ? 0 : ((m10 >= 2 && m10 <= 9) && (m100 < 11 || m100 > 19)) ? 1 : 2;
    else if (l === 'ru') i = (m10 === 1 && m100 !== 11) ? 0 : ((m10 >= 2 && m10 <= 4) && (m100 < 12 || m100 > 14)) ? 1 : 2;
    else i = n === 1 ? 0 : 1;
    return n + ' ' + f[i];
  }
  renderValsLT() {
    var self = this; var s = this.state; var A = this.props.accent || '#E31F25';
    var now = new Date(); var d = now.getDay(); var h = now.getHours() + now.getMinutes() / 60;
    var open = (d >= 1 && d <= 5 && h >= 8 && h < 18) || (d === 6 && h >= 9 && h < 14);
    var statusText = open ? ('Dirbame dabar · iki ' + (d === 6 ? '14:00' : '18:00')) : 'I–V 08–18 · VI 09–14';
    var labels = ['Automobilis', 'Detalė', 'Kontaktai'];
    var stepItems = labels.map(function (l, i) {
      var n = i + 1; var on = n <= s.step;
      return { n: n, label: l, bg: on ? A : '#e2e2e4', fg: on ? '#ffffff' : '#4f5054', lc: n === s.step ? '#2a2a2d' : '#4f5054', weight: n === s.step ? '600' : '500', align: i === 0 ? 'flex-start' : (i === 2 ? 'flex-end' : 'center') };
    });
    var f = s.form;
    var car = [f.make, f.model, f.year].filter(Boolean).join(' ');
    var summary = (f.part || 'Detalė') + (car ? ' · ' + car : '') + (f.vin ? ' · VIN ' + f.vin.toUpperCase() : '') + ' · ' + f.delivery;
    var tabDef = [['part', 'Rasti detalę'], ['sell', 'Parduoti automobilį']];
    var tabs = tabDef.map(function (t) {
      var sel = s.tab === t[0];
      return { label: t[1], sel: sel ? 'true' : 'false', bg: sel ? '#ffffff' : 'transparent', fg: sel ? '#2a2a2d' : '#4f5054', sh: sel ? '0 1px 3px rgba(0,0,0,0.12)' : 'none', pick: function () { self.setState({ tab: t[0] }); } };
    });
    var carsData = this.props.featured || [];
    var VER = function (v) { return v === 'EU' ? { ver: 'EU Version', hasVer: true, verBg: '#1d4ed8', verDot: '#facc15' } : v === 'US' ? { ver: 'US Version', hasVer: true, verBg: '#2a2a2d', verDot: '#ef4444' } : { ver: '', hasVer: false, verBg: '', verDot: '' }; };
    var cars = carsData.map(function (c) {
      return Object.assign({}, c, VER(c.market), { go: function () {}, ask: function () { self.setState({ modalCar: c.title, modalPart: '', modalSent: false, modalErr: false }); } });
    });
    return {
      accent: A,
      accentSoft: this.rgba(A, 0.1),
      pm: s.pm, sm: s.sm,
      openPart: function () { self.setState({ pm: true }); },
      openSell: function () { self.setState({ sm: true }); },
      closePm: function () { self.setState({ pm: false }); },
      closeSm: function () { self.setState({ sm: false }); },
      stop: function (e) { e.stopPropagation(); },
      accentShadow: this.rgba(A, 0.32),
      dbl: [
        { href: (self.props.base || '') + '/automobiliai', img: '/site/cat-cars.jpg', alt: 'Ardomas BMW X5 dalimis', pos: '60% 55%', num: String((self.props.counts || { cars: 0, engines: 0 }).cars), badge: self.plural('cars', (self.props.counts || { cars: 0, engines: 0 }).cars), t1: 'Automobiliai', t2: 'dalimis', sub: 'Originalios dalys iš ardomų donorų Vilniuje.', cta: 'Visi automobiliai' },
        { href: (self.props.base || '') + '/varikliai', img: '/site/cat-engines.jpg', alt: 'Patikrintas variklis ant padėklo', pos: '50% 55%', num: String((self.props.counts || { cars: 0, engines: 0 }).engines), badge: self.plural('engines', (self.props.counts || { cars: 0, engines: 0 }).engines), t1: 'Patikrinti', t2: 'varikliai', sub: 'Naudoti varikliai su garantija. Siunčiame visoje Europoje.', cta: 'Visi varikliai' }
      ].map(function (c, i) {
        var tl = self.state.tilt[i];
        return Object.assign({}, c, {
          anim: 'dbl-in' + (i + 1),
          rx: tl ? tl.rx + 'deg' : '0deg', ry: tl ? tl.ry + 'deg' : '0deg',
          mx: tl ? tl.mx + 'px' : '50%', my: tl ? tl.my + 'px' : '50%',
          sh: tl ? '0 30px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)' : '0 10px 30px rgba(0,0,0,0.25)',
          move: function (e) {
            var r = e.currentTarget.getBoundingClientRect();
            var x = e.clientX - r.left, y = e.clientY - r.top;
            var nt = self.state.tilt.slice();
            nt[i] = { rx: ((0.5 - y / r.height) * 8).toFixed(2), ry: ((x / r.width - 0.5) * 10).toFixed(2), mx: Math.round(x), my: Math.round(y) };
            self.setState({ tilt: nt });
          },
          leave: function () { var nt = self.state.tilt.slice(); nt[i] = null; self.setState({ tilt: nt }); }
        });
      }),
      statusText: statusText,
      statusBg: open ? A : 'rgba(255,255,255,0.16)',
      tabs: tabs,
      isPart: s.tab === 'part', isSell: s.tab === 'sell',
      notSent: !s.sent, sent: s.sent,
      s1: s.step === 1, s2: s.step === 2, s3: s.step === 3,
      stepItems: stepItems,
      progW: s.step === 1 ? '0%' : (s.step === 2 ? 'calc(50% - 11px)' : 'calc(100% - 22px)'),
      form: f, summary: summary,
      channelLabel: f.channel === 'Skambutis' ? 'paskambinsime' : 'parašysime per ' + f.channel,
      setMake: this.setForm('make'), setModel: this.setForm('model'), setYear: this.setForm('year'), setVin: this.setForm('vin'),
      setPart: this.setForm('part'), setNote: this.setForm('note'), setName: this.setForm('name'), setPhone: this.setForm('phone'),
      deliveryOpts: this.chips(['Atsiimsiu', 'Į Lietuvą', 'Į Europą'], f.delivery, function (l) { return self.pickForm('delivery', l); }),
      channelOpts: this.chips(['Skambutis', 'Viber', 'WhatsApp'], f.channel, function (l) { return self.pickForm('channel', l); }),
      hasErr: !!s.err, err: s.err,
      showBack: s.step > 1,
      nextLabel: s.step === 3 ? 'Gauti pasiūlymą →' : 'Toliau →',
      back: function () { self.setState({ step: Math.max(1, s.step - 1), err: '' }); },
      next: function () {
        if (s.step === 1 && !f.make && !f.vin) { self.setState({ err: 'Pasirinkite markę arba įrašykite VIN.' }); return; }
        if (s.step === 2 && !f.part) { self.setState({ err: 'Įrašykite, kokios detalės ieškote.' }); return; }
        if (s.step === 3) { if (!f.phone) { self.setState({ err: 'Įrašykite telefono numerį.' }); return; } self.submit('part', { name: f.name, phone: f.phone, part: f.part, message: f.note, subject: [f.make, f.model, f.year].filter(Boolean).join(' '), vin: f.vin, details: { delivery: f.delivery, channel: f.channel } }, function (e) { if (e) { self.setState({ err: 'Nepavyko išsiųsti. Paskambinkite mums.' }); return; } self.setState({ sent: true, err: '' }); }); return; }
        self.setState({ step: s.step + 1, err: '' });
      },
      reset: function () { self.setState({ sent: false, step: 1, err: '', form: { make: '', model: '', year: '', vin: '', part: '', note: '', delivery: 'Atsiimsiu', name: '', phone: '', channel: 'Skambutis' } }); },
      goPart: function () { self.setState({ tab: 'part' }); },
      goSell: function () { self.setState({ tab: 'sell' }); },
      sell: s.sell, sellSent: s.sellSent, sellNotSent: !s.sellSent, hasSellErr: s.sellErr,
      setSellModel: this.setSell('model'), setSellYear: this.setSell('year'), setSellPhone: this.setSell('phone'),
      condOpts: this.chips(['Važiuoja', 'Nevažiuoja', 'Daužtas'], s.sell.cond, function (l) { return function () { self.setState(function (st) { return { sell: Object.assign({}, st.sell, { cond: l }) }; }); }; }),
      sendSell: function () { if (!s.sell.phone) { self.setState({ sellErr: true }); return; } self.submit('sell', { phone: s.sell.phone, subject: s.sell.model, year: s.sell.year, details: { condition: s.sell.cond } }, function (e) { if (e) { self.setState({ sellErr: true }); return; } self.setState({ sellSent: true, sellErr: false }); }); },
      resetSell: function () { self.setState({ sellSent: false, sell: { model: '', year: '', cond: 'Važiuoja', phone: '' } }); },
      cars: cars,
      faq: (this.props.faq || []).map(function (f, i) { return { q: f.q, a: f.a, open: i === 0 }; }),
      modalOpen: !!s.modalCar, modalCar: s.modalCar, modalPart: s.modalPart, modalPhone: s.modalPhone,
      modalSent: s.modalSent, modalNotSent: !s.modalSent, hasModalErr: s.modalErr,
      setModalPart: function (e) { self.setState({ modalPart: e.target.value }); },
      setModalPhone: function (e) { self.setState({ modalPhone: e.target.value, modalErr: false }); },
      sendModal: function () { if (!s.modalPhone) { self.setState({ modalErr: true }); return; } self.submit('quick', { subject: s.modalCar, part: s.modalPart, phone: s.modalPhone }, function (e) { if (e) { self.setState({ modalErr: true }); return; } self.setState({ modalSent: true }); }); },
      closeModal: function () { self.setState({ modalCar: '', modalSent: false, modalErr: false }); },
      cbPhone: s.cbPhone, cbWhat: s.cbWhat, cbSent: s.cbSent, cbNotSent: !s.cbSent, hasCbErr: s.cbErr,
      setCbPhone: function (e) { self.setState({ cbPhone: e.target.value, cbErr: false }); },
      setCbWhat: function (e) { self.setState({ cbWhat: e.target.value }); },
      sendCb: function () { if (!s.cbPhone) { self.setState({ cbErr: true }); return; } self.submit('callback', { phone: s.cbPhone, message: s.cbWhat }, function (e) { if (e) { self.setState({ cbErr: true }); return; } self.setState({ cbSent: true }); }); }
    };
  }
}
  return Component;
}
