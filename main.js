// Mobil menü aç/kapa
const navToggleButton = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
if (navToggleButton && siteNav) {
  navToggleButton.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggleButton.setAttribute('aria-expanded', String(isOpen));
  });
}

// Aktif menü maddesini işaretle (konuma göre)
const currentPath = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('[data-nav]').forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPath && !link.classList.contains('active')) {
    link.classList.add('active');
  }
});

// Yıl bilgisini ayarla
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

// Yumuşak kaydırma (sayfa içi bağlantılar için)
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const targetId = a.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Reveal animasyonları (IntersectionObserver)
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Galeri: tıklayınca görseli tam boy aç (basit lightbox)
(function initLightbox(){
  const imgs = document.querySelectorAll('.gallery .gcard.image img');
  if (!imgs.length) return;
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `\n    <div class="box">\n      <div class="header">\n        <h3>Görüntü</h3>\n        <button class="close" aria-label="Kapat">×</button>\n      </div>\n      <div class="content">\n        <img id="lb-img" alt="" style="display:block; width:100%; height:auto;" />\n      </div>\n    </div>`;
  document.body.appendChild(modal);
  const imgEl = modal.querySelector('#lb-img');
  const closeBtn = modal.querySelector('.close');
  function open(src, alt){ imgEl.src = src; imgEl.alt = alt || ''; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); }
  function close(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); imgEl.src = ''; }
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e)=>{ if (e.target === modal) close(); });
  imgs.forEach((i)=>{
    // Hover'da otomatik aç
    let hoverTimer;
    i.addEventListener('mouseenter', ()=> {
      hoverTimer = setTimeout(()=> open(i.currentSrc || i.src, i.alt), 120);
    });
    i.addEventListener('mouseleave', ()=> { clearTimeout(hoverTimer); });
    // Tıklama seçeneği yedek kalsın
    i.addEventListener('click', ()=> open(i.currentSrc || i.src, i.alt));
  });
})();

// Dil seçim (i18n) – basit uygulama
(function initI18n(){
  const DICTS = {
    tr: {
      galleryTitle: 'Galeri', download: 'İndir', navHome:'Anasayfa', navLife:'Hayatı', navQuotes:'Sözleri', navGallery:'Galeri', navBooks:'Kitaplar',
      homeTitle: 'Gazi Mustafa Kemal Atatürk',
      homeSubtitle: "Türkiye Cumhuriyeti'nin kurucusu, başöğretmen ve çağdaşlaşmanın öncüsü.",
      hitabeTitle: 'Gençliğe Hitabe', toggleText: 'Metni Göster/Gizle',
      hitabeHtml: `Ey Türk gençliği! Birinci vazifen, Türk istiklâlini, Türk Cumhuriyetini, ilelebet, muhafaza ve müdafaa etmektir. Mevcudiyetinin ve istikbalinin yegâne temeli budur. Bu temel, senin en kıymetli hazinendir.<br/>İstikbalde dahi, seni bu hazineden mahrum etmek isteyecek, dâhilî ve haricî bedhahların olacaktır. Bir gün, istiklâl ve Cumhuriyeti müdafaa mecburiyetine düşersen, vazifeye atılmak için, içinde bulunacağın vaziyetin imkân ve şeraitini düşünmeyeceksin! Bu imkân ve şerait, çok namüsait bir mahiyette tezahür edebilir. İstikâl ve Cumhuriyete kastedecek düşmanlar, bütün dünyada emsali görülmemiş bir galibiyetin mümessili olabilirler. Cebren ve hile ile aziz vatanın bütün kaleleri zaptedilmiş, bütün tersanelerine girilmiş, bütün orduları dağıtılmış ve memleketin her köşesi bilfiil işgal edilmiş olabilir.<br/>Bütün bu şeraitten daha elîm ve daha vahim olmak üzere, memleketin dâhilinde, iktidara sahip olanlar gaflet ve dalâlet ve hattâ hıyanet içinde bulunabilirler. Hattâ bu iktidar sahipleri şahsî menfaatlerini, müstevlilerin siyasî emelleriyle tevhit edebilirler. Millet, fakr u zaruret içinde harap ve bîtap düşmüş olabilir.<br/>Ey Türk istikbalinin evlâdı! İşte, bu ahval ve şerait içinde dahi, vazifen; Türk istiklâl ve Cumhuriyetini kurtarmaktır! Muhtaç olduğun kudret, damarlarındaki asil kanda mevcuttur!`,
      listen:'Atatürk’ten Dinle', footerSite:'Atatürk Anma Sitesi', footerDesigned:'Yiğit KURT tarafından tasarlandı',
      quotesTitle:"Atatürk'ün Sözleri", quotesSubtitle:'İlham veren cümleler.', lifeTitle:"Atatürk'ün Hayatı", lifeSubtitle:'Kronolojik özet ve temel dönüm noktaları.', family:'Aile', gallerySubtitle:'Atatürk indirilebilir fotoğraflar',
      booksTitle:'Kitaplar', booksSubtitle:'Atatürk ve dönemi hakkında temel kaynaklar.', booksList:'Önerilen Kitaplar', bookNutuk:'1919-1927 dönemini birinci ağızdan anlatan temel eser.', bookKinross:'Batı kaynaklı klasik biyografi, geniş başvuru.', bookAksin:'Cumhuriyet’in kuruluş sürecini analitik anlatım.', bookCumhuriyet:'Erken Cumhuriyet yıllarını anlaşılır bir dille sunar.',
      copy:'Kopyala', copied:'Kopyalandı', yil10Title:'10. Yıl Nutku'
    },
    en: { galleryTitle: 'Gallery', download: 'Download', navHome:'Home', navLife:'Life', navQuotes:'Quotes', navGallery:'Gallery', navBooks:'Books', homeTitle: 'Ghazi Mustafa Kemal Atatürk', homeSubtitle: 'Founder of the Republic of Türkiye; great teacher and pioneer of modernization.', hitabeTitle: 'Address to the Youth', toggleText: 'Show/Hide Text', hitabeHtml: `O Turkish youth! Your first duty is, forever, to preserve and defend Turkish independence and the Turkish Republic...`, listen:'Listen to Atatürk', footerSite:'Atatürk Memorial Site', footerDesigned:'Designed by Yiğit KURT', quotesTitle:"Atatürk’s Quotes", quotesSubtitle:'Inspiring sentences.', lifeTitle:"Atatürk’s Life", lifeSubtitle:'Chronology and milestones.', family:'Family', gallerySubtitle:'Downloadable photos of Atatürk', booksTitle:'Books', booksSubtitle:'Core sources on Atatürk and his era.', booksList:'Recommended Books', bookNutuk:'Primary source covering 1919–1927 in first person.', bookKinross:'Classic Western biography and reference.', bookAksin:'Analytical account of the founding period.', bookCumhuriyet:'Accessible overview of early Republic years.', copy:'Copy', copied:'Copied', yil10Title:'10th Year Speech' },
    de: { galleryTitle: 'Galerie', download: 'Herunterladen', homeTitle: 'Gazi Mustafa Kemal Atatürk', homeSubtitle: 'Gründer der Republik Türkei, großer Lehrer und Reformer.', hitabeTitle: 'Ansprache an die Jugend', toggleText: 'Text Ein/Aus', hitabeHtml: `O türkische Jugend! Deine erste Pflicht ist...` },
    fr: { galleryTitle: 'Galerie', download: 'Télécharger', homeTitle: 'Gazi Mustafa Kemal Atatürk', homeSubtitle: 'Fondateur de la République de Turquie; pionnier de la modernisation.', hitabeTitle: 'Adresse à la Jeunesse', toggleText: 'Afficher/Masquer le texte', hitabeHtml: `Ô jeunesse turque ! Ton premier devoir est...` },
    es: { galleryTitle: 'Galería', download: 'Descargar', homeTitle: 'Gazi Mustafa Kemal Atatürk', homeSubtitle: 'Fundador de la República de Türkiye; pionero de la modernización.', hitabeTitle: 'Discurso a la Juventud', toggleText: 'Mostrar/Ocultar', hitabeHtml: `¡Oh juventud turca! Tu primer deber es...` },
    ru: { galleryTitle: 'Галерея', download: 'Скачать', homeTitle: 'Гази Мустафа Кемаль Ататюрк', homeSubtitle: 'Основатель Республики Турция; реформатор и учитель.', hitabeTitle: 'Обращение к молодежи', toggleText: 'Показать/Скрыть', hitabeHtml: `О турецкая молодежь! Твой первый долг...` },
    ar: { galleryTitle: 'المعرض', download: 'تنزيل', homeTitle: 'غازي مصطفى كمال أتاتورك', homeSubtitle: 'مؤسس جمهورية تركيا؛ رائد التحديث.', hitabeTitle: 'خطاب إلى الشباب', toggleText: 'إظهار/إخفاء النص', hitabeHtml: `أيتها الشباب التركي! واجبك الأول...` },
    fa: { galleryTitle: 'گالری', download: 'دانلود', homeTitle: 'غازی مصطفی کمال آتاترک', homeSubtitle: 'بنیان‌گذار جمهوری ترکیه؛ پیشگام نوسازی.', hitabeTitle: 'خطاب به جوانان', toggleText: 'نمایش/پنهان کردن متن', hitabeHtml: `ای جوان ترک! نخستین وظیفه تو...` },
    az: { galleryTitle: 'Qalereya', download: 'Yüklə', homeTitle: 'Qazi Mustafa Kamal Atatürk', homeSubtitle: 'Türkiyə Cümhuriyyətinin qurucusu; modernləşmənin öncüsü.', hitabeTitle: 'Gəncliyə Xitabə', toggleText: 'Mətni Göstər/Gizlət', hitabeHtml: `Ey türk gəncliyi! İlk vəzifən...` },
    zh: { galleryTitle: '图库', download: '下载', homeTitle: '加齐·穆斯塔法·凯末尔·阿塔图尔克', homeSubtitle: '土耳其共和国缔造者；现代化的先驱。', hitabeTitle: '致青年', toggleText: '显示/隐藏', hitabeHtml: `土耳其青年！你的首要职责是……` }
  };
  const defaultLang = 'tr';
  const stored = localStorage.getItem('lang') || defaultLang;

  function applyLang(lang){
    const dict = DICTS[lang] || DICTS[defaultLang];
    // helper getter for inline scripts
    window.getI18n = (key) => (dict && dict[key]) || '';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key]) el.innerHTML = dict[key];
    });
    // Başlık/alt yazı (title/aria-label) gibi attribute çevirileri
    document.querySelectorAll('[data-i18n-title]').forEach((el)=>{
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) el.setAttribute('title', dict[key]);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el)=>{
      const key = el.getAttribute('data-i18n-aria');
      if (dict[key]) el.setAttribute('aria-label', dict[key]);
    });
    // işaretleme
    document.querySelectorAll('.lang-list button').forEach(b=>b.classList.toggle('current', b.dataset.lang===lang));
  }

  applyLang(stored);

  const langRoot = document.getElementById('lang');
  const btn = document.getElementById('lang-btn');
  const list = document.getElementById('lang-list');
  if (btn && langRoot && list) {
    btn.addEventListener('click', () => {
      const open = langRoot.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    list.querySelectorAll('button[data-lang]').forEach((b)=>{
      b.addEventListener('click', () => {
        const lang = b.getAttribute('data-lang');
        localStorage.setItem('lang', lang);
        applyLang(lang);
        langRoot.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', (e) => {
      if (!langRoot.contains(e.target)) { langRoot.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
    });
  }
})();

// 16 Türk Devleti bayrak şeridi (internet görseli ile yer tutucu)
const FOOTER_FLAGS_MOUNT = document.getElementById('footer-flags');
if (FOOTER_FLAGS_MOUNT) {
  /**
   * Not: Şimdilik yer tutucu olarak Türkiye bayrağı bağlanıyor.
   * Onay sonrası her devlet için özgün bayrak URL'leri eklenebilir.
   */
  const placeholderFlag = 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg';
  const states = [
    { name: 'Hun' }, { name: 'Batı Hun' }, { name: 'Avrupa Hun' }, { name: 'Ak Hun' },
    { name: 'Göktürk' }, { name: 'Avar' }, { name: 'Hazar' }, { name: 'Uygur' },
    { name: 'Karahanlı' }, { name: 'Gazneli' }, { name: 'Büyük Selçuklu' }, { name: 'Harzemşah' },
    { name: 'Altın Orda' }, { name: 'Timur' }, { name: 'Babür' }, { name: 'Osmanlı' }
  ];
  const wrapper = document.createElement('div');
  wrapper.className = 'states flags-footer';
  states.forEach(s => {
    const cell = document.createElement('div');
    cell.className = 'state-card';
    const flag = document.createElement('div');
    flag.className = 'flag';
    const img = document.createElement('img');
    img.src = placeholderFlag;
    img.alt = s.name + ' bayrağı';
    img.loading = 'lazy';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    flag.innerHTML = '';
    flag.appendChild(img);
    const text = document.createElement('div');
    const h4 = document.createElement('h4');
    h4.textContent = s.name;
    const p = document.createElement('p');
    p.textContent = '—';
    text.appendChild(h4);
    text.appendChild(p);
    cell.appendChild(flag);
    cell.appendChild(text);
    wrapper.appendChild(cell);
  });
  FOOTER_FLAGS_MOUNT.appendChild(wrapper);
}

// Gençliğe Hitabe: sadece "Atatürk’ten Dinle" (modal video aç)
const hitabeDinleBtn = document.getElementById('hitabe-dinle');
if (hitabeDinleBtn) {
  hitabeDinleBtn.addEventListener('click', () => {
    if (modalVideo) {
      // Hitabe videosunu aç (Mevcutsa 10. Yıl Nutku veya Hitabe videosu yolunu kullan)
      const hitabeSrc = 'video/Atatürkten Gençliğe Hitabesi (AI).mp4';
      if (modalVideo.getAttribute('src') !== hitabeSrc) {
        modalVideo.setAttribute('src', hitabeSrc);
      }
      openModal();
      // Autoplay güvenliği için kullanıcı etkileşimi var; play dene
      modalVideo.play?.();
    }
  });
}

// Modal: Atatürk'ten Dinle
const btnDinle = document.getElementById('btn-dinle');
const modalDinle = document.getElementById('dinle-modal');
const modalClose = document.getElementById('dinle-close');
const modalVideo = document.getElementById('dinle-video');

function openModal() {
  if (!modalDinle) return;
  modalDinle.classList.add('open');
  modalDinle.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  if (!modalDinle) return;
  modalDinle.classList.remove('open');
  modalDinle.setAttribute('aria-hidden', 'true');
  if (modalVideo) { modalVideo.pause(); }
}

btnDinle && btnDinle.addEventListener('click', openModal);
modalClose && modalClose.addEventListener('click', closeModal);
modalDinle && modalDinle.addEventListener('click', (e) => { if (e.target === modalDinle) closeModal(); });

// Footer bayraklarını güncel devletlerle değiştir (TR, AZ, Uygur vb.)
if (FOOTER_FLAGS_MOUNT) {
  FOOTER_FLAGS_MOUNT.innerHTML = '';
  const flags = [
    { name: 'Türkiye', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg' },
    { name: 'Azerbaycan', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Azerbaijan.svg' },
    { name: 'Kuzey Kıbrıs', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg/640px-Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg.png' },
    { name: 'Türkmenistan', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Turkmenistan.svg' },
    { name: 'Kazakistan', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kazakhstan.svg' },
    { name: 'Kırgızistan', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Kyrgyzstan.svg' },
    { name: 'Özbekistan', url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Uzbekistan.svg' },
    { name: 'Uygur', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Kokbayraq_flag.svg/640px-Kokbayraq_flag.svg.png' }
  ];
  const wrapper = document.createElement('div');
  wrapper.className = 'states flags-footer';
  flags.forEach(s => {
    const cell = document.createElement('div');
    cell.className = 'state-card';
    const flag = document.createElement('div');
    flag.className = 'flag';
    const img = document.createElement('img');
    img.src = s.url;
    img.alt = s.name + ' bayrağı';
    img.loading = 'lazy';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    flag.appendChild(img);
    const text = document.createElement('div');
    const h4 = document.createElement('h4');
    h4.textContent = s.name;
    const p = document.createElement('p');
    p.textContent = '';
    text.appendChild(h4);
    text.appendChild(p);
    cell.appendChild(flag);
    cell.appendChild(text);
    wrapper.appendChild(cell);
  });
  FOOTER_FLAGS_MOUNT.appendChild(wrapper);
}

// Sözler: 3 sütunlu kartlara otomatik yerleştir ve kopyalama butonu ekle
const sozlerMount = document.querySelector('#sozler .grid.three');
if (sozlerMount) {
  const items = [
    { q: 'Benim naçiz vücudum elbet bir gün toprak olacaktır; fakat Türkiye Cumhuriyeti ilelebet payidar kalacaktır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Cumhuriyet, fikir serbestliği taraftarı olan bir idaredir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Cumhuriyet, yüksek ahlaki değer ve niteliklere dayanan bir yönetimdir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Türk milletinin karakterine ve adetlerine en uygun olan idare, Cumhuriyet idaresidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Egemenlik, kayıtsız şartsız milletindir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Biz doğrudan doğruya millet severiz ve Türk milliyetçisiyiz.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Türk milletinin tabiat ve geleneklerine en uygun idare Cumhuriyet idaresidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Cumhuriyet fazilettir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Özgürlük ve bağımsızlık benim karakterimdir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Gençler! Cesaretimizi güçlendiren ve sürdüren sizsiniz.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bütün ümidim gençliktedir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Ey yükselen yeni nesil! İstikbal sizsiniz.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Öğretmenler, yeni nesli sizler yetiştireceksiniz; yeni nesil sizin eseriniz olacaktır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'En hakiki mürşit ilimdir, fendir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Hayatta en hakiki mürşit ilimdir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir millet irfan ordusuna malik olmadıkça ... kalıcı sonuçları olmaz.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Eğitimdir ki bir milleti ya özgür, bağımsız, ... ya da esaret ve sefalete terk eder.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Mektep genç dimağlara ... aşkı öğretmelidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Sanatsız kalan bir milletin hayat damarlarından biri kopmuş demektir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Söz konusu olan vatansa, gerisi teferruattır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Hattı müdafaa yoktur, sathı müdafaa vardır; o satıh bütün vatandır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir milletin bağımsızlığı, onun namusu ve şerefidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir ulusun yaşayabilmesi için özgürlük ve bağımsızlığına sahip olması gerekir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Yurtta sulh, cihanda sulh.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Biz Türkler, tarihimiz boyunca hürriyet ve istiklale timsal olduk.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Türk milletinin istidadı ve kesin kararı medeniyet yolunda durmadan ilerlemektir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bağımsızlık, uğruna ölmesini bilen milletlerin hakkıdır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir ulus, özgürlüğünü kaybettikten sonra onu tekrar kazanmak için neler yapması gerektiğini düşünmelidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Türk milletinin karakteri yüksektir, Türk milleti çalışkandır, Türk milleti zekidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Akıl ve mantığın halledemeyeceği mesele yoktur.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bizim akıl, mantık ve zekamızla hareket etmek en büyük silahımızdır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Medeniyet, öyle bir ateştir ki, ona bigâne kalanları yakar.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Medeniyet yolunda yürümek ve başarılı olmak hayatın şartıdır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'İnkılap, var olan kurumları zorla değiştirmektir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Yeni kuşak, fikri hür, vicdanı hür, irfanı hür nesiller olarak yetişmelidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir toplum, cinslerinden yalnız birinin çağın gereklerini öğrenmesiyle yükselemez.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bütün dünya bilsin ki, benim için bir yanda bilim, bir yanda cehalet varsa, ben bilimin yanındayım.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Hayatta en büyük kılavuz bilimdir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir millet sanattan ve sanatkârdan mahrumsa, tam bir hayata malik olamaz.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Sanat güzelliğin ifadesidir ...', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir milletin dili, onun kalbidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Türk demek dil demektir. Milliyetin en bariz vasfı ve delili dildir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Türk dili Türk milletinin kalbidir, zihnidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Millî kültürümüzü çağdaş uygarlık düzeyinin üstüne çıkaracağız.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Kültür, okumak, anlamak, görmek, gördüğünden mana çıkarmaktır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Halkın sesi, hakkın sesidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir ulus, kültür ve sanatla yaşar.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Yüksek bir kültüre sahip olmayan milletler, başka milletlerin esiri olurlar.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Çalışmadan, öğrenmeden, yorulmadan rahat yaşama yollarını arayanlar önce haysiyetlerini, sonra hürriyetlerini kaybederler.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Dinlenmemek üzere yürümeye karar verenler asla yorulmazlar.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Zafer, “Zafer benimdir” diyebilenindir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Başarı, mutlaka gelecektir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Vatanını en çok seven, görevini en iyi yapandır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Türk milleti çalışkandır, Türk milleti zekidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir işte başarı için önce inanmak gerekir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Kendine ve milletine güvenen insanlar başarıya ulaşır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Millete efendilik yoktur; hizmet vardır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Benim manevi mirasım bilim ve akıldır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Uluslararası başarı, millî başarıya bağlıdır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Barış milletleri refaha kavuşturur.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Biz kimsenin düşmanı değiliz ... insanlığın düşmanı olanların düşmanıyız.', a: 'Mustafa Kemal Atatürk' },
    { q: 'İnsanlık demek, başkalarının mutluluğunu düşünmek demektir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Toplum, kadın ve erkekten oluşur; bir yarı zincirliyken öteki göklere yükselemez.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Kadınlarımız ... aynı derecede kültür kazanmadıkça ilerleme mümkün değildir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Kadınlarımız her şeyden önce bir insan olmaları nedeniyle saygıyı hak ederler.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Dünyada her şey kadının eseridir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Medeniyet, kadın ve erkeğin birlikte yürümesiyle ilerler.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Adalet gücü bağımsız olmayan bir milletin devlet halinde varlığı kabul olunamaz.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir devletin gücü, adaletin sağlanmasıyla ölçülür.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Devlet adamları için birinci görev, adaleti korumaktır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir milletin hukuk düzeni, uygarlık seviyesini gösterir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'İstiklal, istikbal, hürriyet, her şey adaletle kaimdir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Adalet mülkün temelidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir toplum, adaletle yaşar.', a: 'Mustafa Kemal Atatürk' },
    { q: 'İdare edenler dürüst olmazsa, yönetilenler de itaat etmez.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Beni övme sözlerini bırakınız, gelecek için neler yapacağız onları söyleyiniz.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Memleketin geleceği, emin ellerde olmalıdır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Benim dinim akıl ve mantık dinidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Türk milleti ahlâk bakımından yüksektir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Din bir vicdan meselesidir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Hiçbir millet yoktur ki ahlâka dayanmadan yükselebilsin.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Vicdan hürriyeti kutsaldır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'İnsanlar yalnız bir şeyden korkmalıdır: yapmamaktan.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir milletin büyüklüğü, fertlerinin yüksek ahlâkıyla ölçülür.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Doğruyu konuşmaktan korkmayınız.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Manevî miras olarak dogma bırakmıyorum.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Hayatta en büyük mutluluk, başkalarının mutluluğu için çalışmaktır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir milletin kurtuluşu, liderinin değil; milletin azim ve iradesinin eseridir.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Umutsuz durumlar yoktur, umutsuz insanlar vardır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Benim yaptıklarımı kimse yapmadı, ama ben de mucize yapmadım.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Korkaklar her gün bin defa ölür; cesurlar yalnız bir defa ölür.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Hiçbir zafer, inançsız kazanılmaz.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Beni görmek demek, yüzümü görmek değildir; fikirlerimi anlamaktır.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Milletin sevgisine mazhar olmak, en büyük mutluluktur.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Bir insan, milletinin varlığını ve mutluluğunu düşünmeden kendini kurtarabilir mi?', a: 'Mustafa Kemal Atatürk' },
    { q: 'Ben, milletimin bir ferdiyim.', a: 'Mustafa Kemal Atatürk' },
    { q: 'Ne mutlu Türküm diyene!', a: 'Mustafa Kemal Atatürk' }
  ];

  items.forEach(({ q, a }) => {
    const fig = document.createElement('figure');
    fig.className = 'card';
    const bq = document.createElement('blockquote');
    bq.className = 'quote';
    bq.textContent = '“' + q + '”';
    const cap = document.createElement('figcaption');
    cap.innerHTML = '<strong>' + a + '</strong>';
    const tools = document.createElement('div');
    tools.style.display = 'flex';
    tools.style.justifyContent = 'flex-end';
    tools.style.marginTop = '8px';
    const btn = document.createElement('button');
    btn.className = 'btn sm';
    btn.type = 'button';
    btn.textContent = 'Kopyala';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(q + ' — ' + a);
        btn.textContent = 'Kopyalandı';
        setTimeout(() => { btn.textContent = 'Kopyala'; }, 1200);
      } catch (e) {
        alert('Kopyalama başarısız oldu.');
      }
    });
    tools.appendChild(btn);
    fig.appendChild(bq);
    fig.appendChild(cap);
    fig.appendChild(tools);
    sozlerMount.appendChild(fig);
  });
}

// sozler.html için 3 sütunlu söz listesini doldur ve kopyalama ekle
const sozlerPageMount = document.querySelector('#sozler-list .grid.four, #sozler-list .grid.three, #sozler-list .grid.two');
if (sozlerPageMount) {
  const items = [
    // Cumhuriyet ve Özgürlük
    'Benim naçiz vücudum elbet bir gün toprak olacaktır; fakat Türkiye Cumhuriyeti ilelebet payidar kalacaktır.',
    'Cumhuriyet, fikir serbestliği taraftarı olan bir idaredir.',
    'Cumhuriyet, yüksek ahlaki değer ve niteliklere dayanan bir yönetimdir.',
    'Türk milletinin karakterine ve adetlerine en uygun olan idare, Cumhuriyet idaresidir.',
    'Egemenlik, kayıtsız şartsız milletindir.',
    'Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.',
    'Biz doğrudan doğruya millet severiz ve Türk milliyetçisiyiz.',
    'Türk milletinin tabiat ve geleneklerine en uygun idare Cumhuriyet idaresidir.',
    'Cumhuriyet fazilettir.',
    'Özgürlük ve bağımsızlık benim karakterimdir.',
    // Eğitim, Gençlik ve Gelecek
    'Gençler! Cesaretimizi güçlendiren ve sürdüren sizsiniz.',
    'Bütün ümidim gençliktedir.',
    'Ey yükselen yeni nesil! İstikbal sizsiniz.',
    'Öğretmenler, yeni nesli sizler yetiştireceksiniz; yeni nesil sizin eseriniz olacaktır.',
    'En hakiki mürşit ilimdir, fendir.',
    'Hayatta en hakiki mürşit ilimdir.',
    'Bir millet irfan ordusuna malik olmadıkça savaşların kalıcı sonuçları olmaz.',
    'Eğitimdir ki bir milleti ya özgür ve yüksek, ya da esarete terk eder.',
    'Mektep genç dimağlara, insanlığa hürmet ve istiklale aşkı öğretmelidir.',
    'Sanatsız kalan bir milletin hayat damarlarından biri kopmuş demektir.',
    // Vatan, Millet ve Bağımsızlık
    'Söz konusu olan vatansa, gerisi teferruattır.',
    'Hattı müdafaa yoktur, sathı müdafaa vardır; o satıh bütün vatandır.',
    'Bir milletin bağımsızlığı, onun namusu ve şerefidir.',
    'Bir ulusun yaşayabilmesi için özgürlük ve bağımsızlığına sahip olması gerekir.',
    'Yurtta sulh, cihanda sulh.',
    'Biz Türkler, bütün tarihimiz boyunca hürriyet ve istiklale timsal olmuş bir milletiz.',
    'Türk milletinin istidadı ve kesin kararı medeniyet yolunda durmadan ilerlemektir.',
    'Bağımsızlık, uğruna ölmesini bilen milletlerin hakkıdır.',
    'Bir ulus, özgürlüğünü kaybettikten sonra onu tekrar kazanmak için neler yapması gerektiğini düşünmelidir.',
    'Türk milletinin karakteri yüksektir, Türk milleti çalışkandır, Türk milleti zekidir.',
    // Akıl, Bilim ve Medeniyet
    'Akıl ve mantığın halledemeyeceği mesele yoktur.',
    'Bizim akıl, mantık ve zekamızla hareket etmek en büyük silahımızdır.',
    'Medeniyet, öyle bir ateştir ki, ona bigâne kalanları yakar.',
    'Medeniyet yolunda yürümek ve başarılı olmak hayatın şartıdır.',
    'İnkılap, var olan kurumları zorla değiştirmektir.',
    'Yeni kuşak, fikri hür, vicdanı hür, irfanı hür nesiller olarak yetişmelidir.',
    'Bir toplum, cinslerinden yalnız birinin çağın gereklerini öğrenmesiyle yükselemez.',
    'Bütün dünya bilsin ki, ben bilimin yanındayım.',
    'Hayatta en büyük kılavuz bilimdir.',
    // Sanat, Kültür ve Dil
    'Bir millet sanattan ve sanatkârdan mahrumsa, tam bir hayata malik olamaz.',
    'Sanat güzelliğin ifadesidir.',
    'Bir milletin dili, onun kalbidir.',
    'Türk demek dil demektir. Milliyetin en bariz vasıf ve delili dildir.',
    'Türk dili Türk milletinin kalbidir, zihnidir.',
    'Millî kültürümüzü çağdaş uygarlık düzeyinin üstüne çıkaracağız.',
    'Kültür, okumak, anlamak, görmek ve mana çıkarmaktır.',
    'Halkın sesi, hakkın sesidir.',
    'Bir ulus, kültür ve sanatla yaşar.',
    'Yüksek bir kültüre sahip olmayan milletler, başka milletlerin esiri olurlar.',
    // Çalışmak ve Başarı
    'Çalışmadan, öğrenmeden, yorulmadan rahat yaşama yollarını arayanlar önce haysiyetlerini, sonra hürriyetlerini kaybederler.',
    'Dinlenmemek üzere yürümeye karar verenler asla yorulmazlar.',
    'Zafer, “Zafer benimdir” diyebilenindir.',
    'Başarı, mutlaka gelecektir.',
    'Vatanını en çok seven, görevini en iyi yapandır.',
    'Bir işte başarı kazanmak için önce inanmak gerekir.',
    'Kendine güvenen, milletine güvenen insanlar başarıya ulaşır.',
    'Millete efendilik yoktur; hizmet vardır.',
    'Benim manevi mirasım bilim ve akıldır.',
    // Dünya, İnsanlık ve Barış
    'Uluslararası başarı, millî başarıya bağlıdır.',
    'Barış milletleri refaha kavuşturur.',
    'Biz kimsenin düşmanı değiliz; yalnız insanlığın düşmanı olanların düşmanıyız.',
    'İnsanlık demek, başkalarının mutluluğunu düşünmek demektir.',
    'Bir toplumun yarısı zincirliyken öteki yarısı göklere yükselemez.',
    'Kadınlarımız aynı öğretimden geçmedikçe ilerleme mümkün değildir.',
    'Kadınlarımız her şeyden önce insandır ve saygıyı hak eder.',
    'Dünyada her şey kadının eseridir.',
    'Medeniyet, kadın ve erkeğin birlikte yürümesiyle ilerler.',
    // Adalet ve Devlet
    'Adalet gücü bağımsız olmayan bir milletin devlet halinde varlığı kabul olunamaz.',
    'Bir devletin gücü, adaletin sağlanmasıyla ölçülür.',
    'Devlet adamları için birinci görev, adaleti korumaktır.',
    'Bir milletin hukuk düzeni, o milletin uygarlık seviyesini gösterir.',
    'İstiklal, istikbal, hürriyet, her şey adaletle kaimdir.',
    'Adalet mülkün temelidir.',
    'Bir toplum, adaletle yaşar.',
    'İdare edenler dürüst olmazsa, yönetilenler de itaat etmez.',
    'Beni övme sözlerini bırakınız, gelecek için neler yapacağız onları söyleyiniz.',
    'Memleketin geleceği, emin ellerde olmalıdır.',
    // İnanç, Karakter ve Ahlak
    'Benim dinim akıl ve mantık dinidir.',
    'Türk milleti ahlâk bakımından yüksektir.',
    'Din bir vicdan meselesidir.',
    'Hiçbir millet yoktur ki ahlâka dayanmadan yükselebilsin.',
    'Vicdan hürriyeti kutsaldır.',
    'İnsanlar yalnız bir şeyden korkmalıdır: yapmamaktan.',
    'Bir milletin büyüklüğü, fertlerinin yüksek ahlâkıyla ölçülür.',
    'Doğruyu konuşmaktan korkmayınız.',
    'Ben, manevî miras olarak dogma bırakmıyorum.',
    'Hayatta en büyük mutluluk, başkalarının mutluluğu için çalışmaktır.',
    // Motivasyon ve Liderlik
    'Bir milletin kurtuluşu, liderinin değil; milletin azim ve iradesinin eseridir.',
    'Umutsuz durumlar yoktur, umutsuz insanlar vardır.',
    'Benim yaptıklarımı kimse yapmadı, ama ben de mucize yapmadım.',
    'Korkaklar, her gün bin defa ölür; cesurlar yalnız bir defa ölür.',
    'Hiçbir zafer, inançsız kazanılmaz.',
    'Beni görmek demek, yüzümü görmek değildir; fikirlerimi, duygularımı anlamaktır.',
    'Milletin sevgisine mazhar olmak, en büyük mutluluktur.',
    'Bir insan, mensup olduğu milletin varlığını ve mutluluğunu düşünmeden kendini kurtarabilir mi?',
    'Ben, milletimin bir ferdiyim.',
    'Ne mutlu Türküm diyene!'
  ];

  items.forEach((q) => {
    const fig = document.createElement('figure');
    fig.className = 'card';
    const bq = document.createElement('blockquote');
    bq.className = 'quote';
    bq.textContent = '“' + q + '”';
    const tools = document.createElement('div');
    tools.style.display = 'flex';
    tools.style.justifyContent = 'flex-end';
    tools.style.marginTop = '8px';
    const btn = document.createElement('button');
    btn.className = 'btn sm';
    btn.type = 'button';
    btn.textContent = 'Kopyala';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(q + ' — Mustafa Kemal Atatürk');
        btn.textContent = 'Kopyalandı';
        setTimeout(() => { btn.textContent = 'Kopyala'; }, 1200);
      } catch (e) {
        alert('Kopyalama başarısız oldu.');
      }
    });
    tools.appendChild(btn);
    fig.appendChild(bq);
    fig.appendChild(tools);
    sozlerPageMount.appendChild(fig);
  });
}


