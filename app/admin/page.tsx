/* app/admin/page.tsx */
"use client";

import { useState, useRef } from "react";

type Section = "hero" | "icons" | "gilding" | "mosaic" | "various" | "murals" | "artist";

interface ImageItem {
  id: string; src: string;
  title: string; medium: string; dims: string; year: string; location: string;
  section: Section; size?: string;
  titleAr?: string; mediumAr?: string; locationAr?: string;
}

const ADMIN_PASSWORD = "danadahdal";

const SECTION_LABELS: Record<Section, string> = {
  hero: "الهيرو", artist: "صورة الفنانة", icons: "ايقونات",
  gilding: "تذهيب ونقش", mosaic: "فسيفساء", various: "معارض", murals: "الجداريات",
};
const ALL_SECTIONS: Section[] = ["hero","artist","icons","gilding","mosaic","various","murals"];

const INITIAL: ImageItem[] = [
  { id:"h1",  src:"/hero.png",         title:"Hero Background",           medium:"", dims:"", year:"", location:"", section:"hero" },
  { id:"a1",  src:"/icons/artist.png", title:"Artist Portrait",           medium:"", dims:"", year:"", location:"", section:"artist" },
  { id:"i1",  src:"/icons/icon1.jpg",  title:"The Descent into Hades",   medium:"Egg Tempera & 24K Gold Leaf on Wood", dims:"45 × 60 cm", year:"2021", location:"Private Collection, Beirut",  section:"icons" },
  { id:"i2",  src:"/icons/icon2.jpg",  title:"Theotokos of the Sign",    medium:"Mineral Pigments on Gessoed Panel",  dims:"30 × 40 cm", year:"2022", location:"Cairo, Egypt",               section:"icons" },
  { id:"i3",  src:"/icons/icon3.jpg",  title:"Christ the High Priest",   medium:"Egg Tempera & 24K Gold Leaf on Wood",dims:"40 × 55 cm", year:"2023", location:"Private Collection, Amman",  section:"icons" },
  { id:"g1",  src:"/icons/icon2.jpg",  title:"The Flight into Egypt",    medium:"Traditional Pigments on Canvas",     dims:"60 × 80 cm", year:"2022", location:"Cairo, Egypt",               section:"gilding" },
  { id:"g2",  src:"/icons/icon3.jpg",  title:"Saint Mark the Evangelist",medium:"Egg Tempera & Gold Leaf",            dims:"35 × 50 cm", year:"2023", location:"St. Mark's Cathedral, Cairo",section:"gilding" },
  { id:"mo1", src:"/icons/icon3.jpg",  title:"The Annunciation",         medium:"Glass Mosaic Tesserae",              dims:"80 × 100 cm",year:"2023", location:"Private Collection, Dubai",  section:"mosaic" },
  { id:"mo2", src:"/icons/icon1.jpg",  title:"Archangel Michael",        medium:"Stone & Glass Mosaic",              dims:"60 × 90 cm", year:"2022", location:"St. Michael's, Jordan",      section:"mosaic" },
  { id:"v1",  src:"/icons/icon1.jpg",  title:"Sacred Vessel",            medium:"Egg Tempera & 24K Gold Leaf on Wood",dims:"45 × 60 cm", year:"2021", location:"Private Collection, Beirut", section:"various" },
  { id:"v2",  src:"/icons/icon2.jpg",  title:"The Pilgrim's Path",       medium:"Mineral Pigments on Gessoed Panel", dims:"30 × 40 cm", year:"2022", location:"Cairo, Egypt",               section:"various" },
  { id:"mu1", src:"/icons/icon1.jpg",  title:"The Pantocrator Dome",     medium:"Fresco Technique",  dims:"", year:"2021–2022", location:"St. Mary's Cathedral, Jordan", section:"murals", size:"120 sqm" },
  { id:"mu2", src:"/icons/icon2.jpg",  title:"The Last Supper",          medium:"Acrylic on Plaster",dims:"", year:"2020",     location:"St. George's Church, Cairo",  section:"murals", size:"85 sqm"  },
];

type FormData = Omit<ImageItem,"id">;
const emptyForm = (): FormData => ({
  src:"", title:"", medium:"", dims:"", year:"", location:"", section:"icons", size:"",
  titleAr:"", mediumAr:"", locationAr:"",
});

/* ══════════════════════════════════════════════
   TRANSLATION DICTIONARY — عربي → إنجليزي
   مرتب من الأطول للأقصر (مهم للاستبدال الصحيح)
══════════════════════════════════════════════ */
const DICT: [string, string][] = [
  ["بيضة التمبيرا وورق الذهب عيار 24 قيراط", "Egg Tempera & 24K Gold Leaf"],
  ["بيضة التمبيرا وورق الذهب عيار 24",       "Egg Tempera & 24K Gold Leaf"],
  ["بيضة التمبيرا وأوراق الذهب",             "Egg Tempera & Gold Leaf"],
  ["بيضة التمبيرا وورق الذهب",               "Egg Tempera & Gold Leaf"],
  ["أصباغ معدنية على لوح مجصص",               "Mineral Pigments on Gessoed Panel"],
  ["ألوان تقليدية على قماش",                  "Traditional Pigments on Canvas"],
  ["فسيفساء زجاجية وحجرية",                   "Stone & Glass Mosaic"],
  ["مجموعة خاصة، بيروت",                      "Private Collection, Beirut"],
  ["مجموعة خاصة، عمّان",                      "Private Collection, Amman"],
  ["مجموعة خاصة، دبي",                        "Private Collection, Dubai"],
  ["مجموعة خاصة، الرياض",                     "Private Collection, Riyadh"],
  ["مجموعة خاصة، القاهرة",                    "Private Collection, Cairo"],
  ["مجموعة خاصة، باريس",                      "Private Collection, Paris"],
  ["مجموعة خاصة، لندن",                       "Private Collection, London"],
  ["كاتدرائية القديس مرقس، القاهرة",           "St. Mark's Cathedral, Cairo"],
  ["كنيسة القديس جورج، القاهرة",              "St. George's Church, Cairo"],
  ["كاتدرائية القديسة مريم، الأردن",           "St. Mary's Cathedral, Jordan"],
  ["دير القديس أنطونيوس",                     "St. Anthony's Monastery"],
  ["دير القديس بيشوي",                         "St. Bishoy Monastery"],
  ["بيضة التمبيرا",    "Egg Tempera"],
  ["تمبيرا البيض",     "Egg Tempera"],
  ["ورق الذهب",        "Gold Leaf"],
  ["أوراق الذهب",      "Gold Leaf"],
  ["أصباغ معدنية",     "Mineral Pigments"],
  ["لوح مجصص",         "Gessoed Panel"],
  ["فسيفساء زجاجية",   "Glass Mosaic Tesserae"],
  ["فسيفساء زجاجي",    "Glass Mosaic"],
  ["فسيفساء حجرية",    "Stone Mosaic"],
  ["فريسكو سيكو",      "Fresco Secco"],
  ["فريسكو",           "Fresco"],
  ["أكريليك على جبس",  "Acrylic on Plaster"],
  ["أكريليك",          "Acrylic"],
  ["زيت على كتان",     "Oil on Linen"],
  ["زيت على قماش",     "Oil on Canvas"],
  ["ألوان تقليدية",    "Traditional Pigments"],
  ["مجموعة خاصة",     "Private Collection"],
  ["القاهرة، مصر",     "Cairo, Egypt"],
  ["بيروت، لبنان",     "Beirut, Lebanon"],
  ["عمّان، الأردن",    "Amman, Jordan"],
  ["القاهرة",          "Cairo"],
  ["بيروت",            "Beirut"],
  ["عمّان",            "Amman"],
  ["الأردن",           "Jordan"],
  ["مصر",              "Egypt"],
  ["دبي",              "Dubai"],
  ["الرياض",           "Riyadh"],
  ["النزول إلى الجحيم",         "The Descent into Hades"],
  ["والدة الإله",                "Theotokos"],
  ["المسيح الكاهن الأعظم",       "Christ the High Priest"],
  ["الهروب إلى مصر",             "The Flight into Egypt"],
  ["مار مرقس الإنجيلي",          "Saint Mark the Evangelist"],
  ["البشارة",                    "The Annunciation"],
  ["رئيس الملائكة ميخائيل",      "Archangel Michael"],
  ["قبة بانتوكراتور",            "The Pantocrator Dome"],
  ["العشاء الأخير",               "The Last Supper"],
  ["صعود السيد",                 "The Ascension"],
  ["القيامة المقدسة",             "The Holy Resurrection"],
  ["القيامة",                    "The Resurrection"],
];

/* ترجمة نص من العربية للإنجليزية */
function translateArToEn(text: string): string {
  if (!text || !text.trim()) return "";
  // تطابق كامل
  for (const [ar, en] of DICT) {
    if (text.trim() === ar) return en;
  }
  // استبدال جزئي
  let result = text;
  for (const [ar, en] of DICT) {
    result = result.split(ar).join(en);
  }
  return result;
}

/* ══ LOGIN ══ */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw]       = useState("");
  const [err, setErr]     = useState(false);
  const [shake, setShake] = useState(false);
  const submit = () => {
    if (pw === ADMIN_PASSWORD) { onLogin(); }
    else { setErr(true); setShake(true); setTimeout(() => setShake(false), 500); }
  };
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6" dir="rtl">
      <div className="mb-10 text-center">
        <p className="text-[#b8955a] text-sm tracking-[0.5em] uppercase mb-3">لوحة التحكم</p>
        <h1 className="text-white text-2xl sm:text-3xl font-semibold tracking-[0.3em] uppercase">Dana Fawaz Dahdal</h1>
        <div className="w-12 h-[1px] bg-[#b8955a] mx-auto mt-5" />
      </div>
      <div className={`w-full max-w-sm ${shake ? "shake" : ""}`}>
        <label className="block text-neutral-400 text-sm tracking-[0.4em] uppercase mb-3">كلمة المرور</label>
        <input type="password" value={pw} autoFocus onChange={e => { setPw(e.target.value); setErr(false); }} onKeyDown={e => e.key === "Enter" && submit()} placeholder="أدخل كلمة المرور" className="w-full bg-transparent border-b-2 border-neutral-700 focus:border-[#b8955a] text-white text-lg pb-3 placeholder:text-neutral-600 outline-none transition-colors" />
        {err && <p className="text-red-400 text-sm mt-3">❌ كلمة المرور غير صحيحة</p>}
        <button onClick={submit} className="mt-8 w-full py-4 bg-[#b8955a] text-black text-base tracking-[0.4em] uppercase font-bold hover:bg-[#d4af7a] transition-colors">دخول →</button>
      </div>
      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}}
        .shake{animation:shake .45s ease-in-out}
        .lc1{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
        .lc2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      `}</style>
    </div>
  );
}

function Toast({ msg }: { msg: string }) {
  return <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] bg-[#b8955a] text-black text-sm tracking-[0.25em] uppercase font-bold px-8 py-4 shadow-2xl whitespace-nowrap">{msg}</div>;
}

/* ══════════════════════════════════════════════
   DUAL FIELD
   ─────────────────────────────────────────────
   تصميم واضح:
   ┌─────────────────────┬─────────────────────┐
   │ 🟡 أدخل عربي هنا   │ 🔤 النتيجة الإنجليزية│
   │  (أنت تكتب هنا)    │  (بيتملى أوتوماتيك) │
   └─────────────────────┴─────────────────────┘
   مهم: الـ parent مش عنده dir="rtl" عشان ما يعكسش الترتيب
══════════════════════════════════════════════ */
function DualField({ labelAr, labelEn, valueAr, valueEn, onChangeAr, onChangeEn, placeholderAr, placeholderEn }: {
  labelAr: string; labelEn: string;
  valueAr: string; valueEn: string;
  onChangeAr: (v: string) => void;
  onChangeEn: (v: string) => void;
  placeholderAr: string; placeholderEn: string;
}) {
  return (
    /* dir="ltr" على الـ wrapper عشان العمود الأيسر يفضل أيسر حتى لو الـ parent rtl */
    <div className="grid grid-cols-2 gap-0 rounded overflow-hidden border border-neutral-700" dir="ltr">

      {/* العمود الأيسر: المستخدم يكتب عربي هنا */}
      <div className="bg-[#1e1a10] p-3 border-r border-neutral-700">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] text-[#b8955a] font-bold">✏</span>
          <label className="text-[#b8955a] text-[10px] tracking-[0.25em] uppercase font-bold">{labelAr}</label>
        </div>
        <input
          value={valueAr}
          onChange={e => onChangeAr(e.target.value)}
          placeholder={placeholderAr}
          dir="rtl"
          className="w-full bg-transparent border-b border-[#b8955a]/50 focus:border-[#b8955a]
                     text-white text-sm py-1.5 placeholder:text-neutral-600 outline-none transition-colors text-right"
        />
      </div>

      {/* العمود الأيمن: الترجمة بتتملى هنا أوتوماتيك */}
      <div className="bg-[#141414] p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] text-neutral-500">🔤</span>
          <label className="text-neutral-500 text-[10px] tracking-[0.25em] uppercase">{labelEn}</label>
        </div>
        <input
          value={valueEn}
          onChange={e => onChangeEn(e.target.value)}
          placeholder={placeholderEn}
          dir="ltr"
          className="w-full bg-transparent border-b border-neutral-700 focus:border-[#b8955a]
                     text-neutral-300 text-sm py-1.5 placeholder:text-neutral-700 outline-none transition-colors"
        />
      </div>
    </div>
  );
}

/* ══ DASHBOARD ══ */
function Dashboard() {
  const [images,     setImages]     = useState<ImageItem[]>(INITIAL);
  const [activeTab,  setActiveTab]  = useState<Section|"all">("all");
  const [form,       setForm]       = useState<FormData>(emptyForm());
  const [editId,     setEditId]     = useState<string|null>(null);
  const [showForm,   setShowForm]   = useState(false);
  const [confirmDel, setConfirmDel] = useState<string|null>(null);
  const [toast,      setToast]      = useState<string|null>(null);
  const [saved,      setSaved]      = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  const setF = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setF("src", URL.createObjectURL(file));
  };

  /* ══════════════════════════════════
     TRANSLATE
     ─────────────────────────────────
     المستخدم يكتب في: titleAr / mediumAr / locationAr
     الناتج يروح في:   title   / medium   / location
  ══════════════════════════════════ */
  const handleTranslate = () => {
    const arTitle    = (form.titleAr    ?? "").trim();
    const arMedium   = (form.mediumAr   ?? "").trim();
    const arLocation = (form.locationAr ?? "").trim();

    if (!arTitle && !arMedium && !arLocation) {
      showToast("⚠ اكتب في الحقول العربية (العمود الأصفر) أولاً");
      return;
    }

    // ترجمة كل حقل من العربي للإنجليزي
    const enTitle    = arTitle    ? translateArToEn(arTitle)    : "";
    const enMedium   = arMedium   ? translateArToEn(arMedium)   : "";
    const enLocation = arLocation ? translateArToEn(arLocation) : "";

    // نكتب الناتج في الحقول الإنجليزية
    setForm(f => ({
      ...f,
      title:    enTitle    || f.title,
      medium:   enMedium   || f.medium,
      location: enLocation || f.location,
    }));

    // نحدد إيه اتترجم وإيه محتاج يكمل يدوياً
    const incomplete: string[] = [];
    if (arTitle    && enTitle    === arTitle)    incomplete.push("العنوان");
    if (arMedium   && enMedium   === arMedium)   incomplete.push("الخامة");
    if (arLocation && enLocation === arLocation) incomplete.push("الموقع");

    if (incomplete.length > 0) {
      showToast(`✓ تمت الترجمة — أكمل يدوياً: ${incomplete.join("، ")}`);
    } else {
      showToast("✓ تمت الترجمة بالكامل");
    }
  };

  const handleSaveItem = () => {
    if (!form.src)   { showToast("⚠ أضف صورة أولاً"); return; }
    if (!form.title) { showToast("⚠ أدخل العنوان الإنجليزي"); return; }
    if (editId) { setImages(imgs => imgs.map(img => img.id === editId ? { ...form, id: editId } : img)); }
    else        { setImages(imgs => [...imgs, { ...form, id: `img-${Date.now()}` }]); }
    setSaved(false);
    showToast("✓ تم — اضغط «حفظ» للتأكيد");
    resetForm();
  };

  const handleGlobalSave = () => { setSaved(true); showToast("✓ تم حفظ التغييرات"); };

  const handleDelete = (id: string) => {
    setImages(imgs => imgs.filter(img => img.id !== id));
    setConfirmDel(null); setSaved(false);
    showToast("✓ تم الحذف");
  };

  const handleEdit = (img: ImageItem) => {
    const { id, ...rest } = img;
    setForm({ ...rest, titleAr: img.titleAr ?? "", mediumAr: img.mediumAr ?? "", locationAr: img.locationAr ?? "" });
    setEditId(id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => { setForm(emptyForm()); setEditId(null); setShowForm(false); };
  const filtered  = activeTab === "all" ? images : images.filter(img => img.section === activeTab);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white" dir="rtl">
      {toast && <Toast msg={toast} />}

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-neutral-800 px-4 sm:px-8 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => { sessionStorage.setItem("visited", "1"); window.location.href = "/"; }} className="flex items-center gap-2 text-neutral-500 hover:text-[#b8955a] text-xs sm:text-sm tracking-[0.3em] uppercase transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
              <span className="hidden sm:inline">العودة للموقع</span>
            </button>
            <div className="w-px h-7 bg-neutral-800 hidden sm:block" />
            <div>
              <h1 className="text-[#b8955a] text-base sm:text-xl tracking-[0.25em] uppercase font-semibold">لوحة التحكم</h1>
              <p className="text-neutral-600 text-xs tracking-[0.3em] hidden sm:block mt-0.5">Dana Fawaz Dahdal · Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={handleGlobalSave} className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm tracking-[0.3em] uppercase font-semibold transition-all border ${!saved ? "bg-[#b8955a] border-[#b8955a] text-black hover:bg-[#d4af7a]" : "border-neutral-700 text-neutral-500 hover:border-[#b8955a] hover:text-[#b8955a]"}`}>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              حفظ{!saved ? " *" : ""}
            </button>
            <button onClick={() => { resetForm(); setShowForm(v => !v); }} className="flex items-center gap-2 border border-[#b8955a] text-[#b8955a] px-4 sm:px-6 py-3 text-sm tracking-[0.3em] uppercase hover:bg-[#b8955a] hover:text-black transition-all font-semibold">
              {showForm ? "✕ إغلاق" : "+ إضافة"}
            </button>
          </div>
        </div>
      </header>

      {/* FORM */}
      {showForm && (
        <div className="border-b border-neutral-800 bg-[#111] px-4 sm:px-8 py-8">
          <h2 className="text-lg tracking-[0.3em] uppercase text-neutral-200 mb-6 flex items-center gap-3 font-semibold">
            <span className="text-[#b8955a] text-2xl">{editId ? "✎" : "+"}</span>
            {editId ? "تعديل الصورة" : "إضافة صورة جديدة"}
          </h2>

          {/* Section */}
          <div className="mb-6">
            <p className="text-neutral-400 text-xs tracking-[0.4em] uppercase mb-3 font-semibold">القسم *</p>
            <div className="flex flex-wrap gap-2">
              {ALL_SECTIONS.map(s => (
                <button key={s} onClick={() => setF("section", s)} className={`px-4 py-2 text-sm tracking-[0.25em] uppercase border transition-all ${form.section === s ? "bg-[#b8955a] border-[#b8955a] text-black font-bold" : "border-neutral-700 text-neutral-400 hover:border-[#b8955a] hover:text-[#b8955a]"}`}>
                  {SECTION_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="mb-6">
            <p className="text-neutral-400 text-xs tracking-[0.4em] uppercase mb-3 font-semibold">الصورة *</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-3">
                <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-neutral-700 hover:border-[#b8955a] cursor-pointer h-24 flex flex-col items-center justify-center gap-2 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-neutral-500 fill-none" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span className="text-neutral-500 text-xs tracking-widest uppercase">اضغط لرفع صورة</span>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                <input value={form.src} onChange={e => setF("src", e.target.value)} placeholder="أو الصق رابط الصورة هنا" dir="ltr" className="w-full bg-[#1a1a1a] border border-neutral-700 text-white text-sm px-3 py-2.5 placeholder:text-neutral-600 outline-none focus:border-[#b8955a] transition-colors" />
              </div>
              {form.src && <div className="w-24 h-28 flex-shrink-0 border border-neutral-800 overflow-hidden"><img src={form.src} alt="preview" className="w-full h-full object-cover" /></div>}
            </div>
          </div>

          {/* ── شرح كيفية الاستخدام ── */}
          <div className="mb-4 p-4 bg-[#1a1a1a] border-r-4 border-[#b8955a]">
            <p className="text-[#b8955a] text-sm font-bold mb-1">كيفية الاستخدام:</p>
            <p className="text-neutral-400 text-xs leading-relaxed">
              ١. اكتب بيانات العمل بالعربية في <span className="text-[#b8955a] font-semibold">العمود الأصفر (يسار)</span><br/>
              ٢. اضغط زر <span className="text-[#b8955a] font-semibold">«ترجمة عربي → إنجليزي»</span><br/>
              ٣. ستظهر الترجمة تلقائياً في <span className="text-neutral-300 font-semibold">العمود الرمادي (يمين)</span><br/>
              ٤. يمكنك تعديل العمود الإنجليزي يدوياً إذا أردت
            </p>
          </div>

          {/* ── Dual fields ── */}
          <div className="space-y-3 mb-6">
            <DualField
              labelAr="✏ العنوان (اكتب عربي)" labelEn="Title in English (auto)"
              valueAr={form.titleAr ?? ""}    valueEn={form.title}
              onChangeAr={v => setF("titleAr", v)} onChangeEn={v => setF("title", v)}
              placeholderAr="مثال: النزول إلى الجحيم"  placeholderEn="Translated result..."
            />
            <DualField
              labelAr="✏ الخامة (اكتب عربي)" labelEn="Medium in English (auto)"
              valueAr={form.mediumAr ?? ""}   valueEn={form.medium}
              onChangeAr={v => setF("mediumAr", v)} onChangeEn={v => setF("medium", v)}
              placeholderAr="مثال: بيضة التمبيرا وورق الذهب" placeholderEn="Translated result..."
            />
            <DualField
              labelAr="✏ الموقع (اكتب عربي)" labelEn="Location in English (auto)"
              valueAr={form.locationAr ?? ""}  valueEn={form.location}
              onChangeAr={v => setF("locationAr", v)} onChangeEn={v => setF("location", v)}
              placeholderAr="مثال: مجموعة خاصة، بيروت" placeholderEn="Translated result..."
            />

            <div className="grid grid-cols-2 gap-4 mt-2" dir="ltr">
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-400 text-xs tracking-[0.35em] uppercase">Dimensions</label>
                <input value={form.dims} onChange={e => setF("dims", e.target.value)} placeholder="45 × 60 cm" className="bg-[#1a1a1a] border-b-2 border-neutral-700 focus:border-[#b8955a] text-white text-sm py-2.5 placeholder:text-neutral-600 outline-none transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-400 text-xs tracking-[0.35em] uppercase">Year</label>
                <input value={form.year} onChange={e => setF("year", e.target.value)} placeholder="2024" className="bg-[#1a1a1a] border-b-2 border-neutral-700 focus:border-[#b8955a] text-white text-sm py-2.5 placeholder:text-neutral-600 outline-none transition-colors" />
              </div>
            </div>
            {form.section === "murals" && (
              <div className="flex flex-col gap-1.5 w-1/2" dir="ltr">
                <label className="text-neutral-400 text-xs tracking-[0.35em] uppercase">Scale</label>
                <input value={form.size ?? ""} onChange={e => setF("size", e.target.value)} placeholder="120 sqm" className="bg-[#1a1a1a] border-b-2 border-neutral-700 focus:border-[#b8955a] text-white text-sm py-2.5 placeholder:text-neutral-600 outline-none transition-colors" />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleSaveItem} className="px-8 py-3.5 bg-[#b8955a] text-black text-sm tracking-[0.35em] uppercase font-bold hover:bg-[#d4af7a] transition-colors">
              {editId ? "تحديث الصورة" : "إضافة الصورة"}
            </button>
            <button onClick={handleTranslate} className="flex items-center gap-2 px-6 py-3.5 border-2 border-[#b8955a] text-[#b8955a] text-sm tracking-[0.25em] uppercase font-bold hover:bg-[#b8955a] hover:text-black transition-all">
              🔤 ترجمة عربي → إنجليزي
            </button>
            <button onClick={resetForm} className="px-5 py-3.5 text-neutral-500 text-sm tracking-[0.3em] uppercase hover:text-neutral-300 transition-colors">إلغاء</button>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="border-b border-neutral-800 px-4 sm:px-8 py-3 flex gap-2 sm:gap-4 overflow-x-auto">
        {(["all", ...ALL_SECTIONS] as (Section | "all")[]).map(key => {
          const count = key === "all" ? images.length : images.filter(i => i.section === key).length;
          const label = key === "all" ? "الكل" : SECTION_LABELS[key as Section];
          return (
            <button key={key} onClick={() => setActiveTab(key)} className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm tracking-[0.2em] uppercase whitespace-nowrap border-b-2 transition-all font-medium ${activeTab === key ? "border-[#b8955a] text-[#b8955a]" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}>
              {label}
              <span className={`text-xs px-2 py-0.5 ${activeTab === key ? "bg-[#b8955a]/20 text-[#b8955a]" : "bg-neutral-800 text-neutral-500"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* GRID */}
      <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {filtered.map(img => (
          <div key={img.id} className="group bg-[#161616] border border-neutral-800 hover:border-[#b8955a]/60 transition-all">
            <div className="relative overflow-hidden" style={{ paddingBottom: "120%" }}>
              <img src={img.src} alt={img.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-2 right-2 bg-black/75 text-[#b8955a] text-xs tracking-widest uppercase px-2 py-1">{SECTION_LABELS[img.section]}</span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-neutral-100 lc2 leading-snug">{img.title}</h3>
              {img.medium   && <p className="text-xs text-neutral-500 italic mt-1 lc1">{img.medium}</p>}
              {img.location && <p className="text-xs text-neutral-600 mt-1 truncate">{img.location}</p>}
              {img.year     && <p className="text-xs text-[#b8955a]/70 mt-1">{img.year}</p>}
            </div>
            <div className="border-t border-neutral-800 flex">
              <button onClick={() => handleEdit(img)} className="flex-1 py-3 text-sm tracking-[0.2em] uppercase text-neutral-400 hover:text-[#b8955a] hover:bg-neutral-800 transition-all font-medium">تعديل</button>
              <span className="w-px bg-neutral-800" />
              {confirmDel === img.id ? (
                <>
                  <button onClick={() => handleDelete(img.id)} className="flex-1 py-3 text-sm uppercase text-red-400 hover:bg-red-950/40 transition-colors font-bold">تأكيد</button>
                  <span className="w-px bg-neutral-800" />
                  <button onClick={() => setConfirmDel(null)} className="flex-1 py-3 text-sm uppercase text-neutral-500 hover:bg-neutral-800 transition-colors">إلغاء</button>
                </>
              ) : (
                <button onClick={() => setConfirmDel(img.id)} className="flex-1 py-3 text-sm tracking-[0.2em] uppercase text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-all font-medium">حذف</button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center py-20 text-neutral-600 text-base tracking-[0.4em] uppercase">لا توجد صور في هذا القسم</div>}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn ? <Dashboard /> : <LoginScreen onLogin={() => setLoggedIn(true)} />;
}