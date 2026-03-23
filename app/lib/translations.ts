/* app/lib/translations.ts */

export const translations = {
  en: {
    // Hero
    role:         "Byzantine Iconographer",
    sacredArt:    "Sacred Art Since 2008",
    heroName:     "Dana Fawaz",
    heroSurname:  "Dahdal",

    // Nav
    navGallery:     "Gallery",
    navMurals:      "Murals",
    navExhibitions: "Exhibitions",
    navAbout:       "About",
    navContact:     "Contact",

    // Gallery
    selectedWorks: "Selected Works",
    gallery:       "Gallery",
    tabs: ["Icons", "Gilding & Engraving", "Mosaic"] as [string, string, string],

    // Murals
    muralsLabel:   "Murals",
    andDomes:      "& Domes",
    exploreMurals: "Explore All Murals",

    // Exhibitions
    various: "Exhibitions",

    // About
    philosophy:    "Philosophy",
    beyondVisible: "Beyond the Visible World",
    bio1:          "Dana Fawaz Dahdal is a master of Byzantine iconography, a sacred art form where every line is a prayer and every color a theological statement.",
    quote:         '"My work is not about creating art; it is about revealing the light that has existed for centuries within the sacred canons."',
    bio2:          "Specializing in egg tempera and 24K gold leaf, her icons adorn cathedrals and private collections across the Middle East and Europe, preserving a tradition that spans over two millennia.",
    handCaption:   "The hand that traces the divine",

    // Contact
    commissionWork: "Commission a Work",
    contact:        "Contact",
    name:           "Name",
    email:          "Email",
    yourName:       "Your Name",
    emailAddress:   "Email Address",
    subject:        "Subject",
    message:        "Message",
    yourMessage:    "Your Message",
    sendMessage:    "Send Message",

    // Lightbox
    scrollZoom: "Scroll to zoom · Drag to pan",
    prev:       "Prev",
    next:       "Next",

    // Footer
    copyright: "© 2024 Dana Fawaz Dahdal",
  },

  ar: {
    // Hero
    role:         "رسامة أيقونات بيزنطية",
    sacredArt:    "فن مقدس منذ 2008",
    heroName:     "دانا فواز",
    heroSurname:  "دحدل",

    // Nav
    navGallery:     "المعرض",
    navMurals:      "الجداريات",
    navExhibitions: "معارض",
    navAbout:       "عن الفنانة",
    navContact:     "تواصل",

    // Gallery
    selectedWorks: "أعمال مختارة",
    gallery:       "المعرض",
    tabs: ["ايقونات", "تذهيب ونقش", "فسيفساء"] as [string, string, string],

    // Murals
    muralsLabel:   "الجداريات",
    andDomes:      "والقباب",
    exploreMurals: "استعرض كل الجداريات",

    // Exhibitions
    various: "معارض",

    // About
    philosophy:    "الفلسفة",
    beyondVisible: "ما وراء العالم المرئي",
    bio1:          "دانا فواز دحدل فنانة متمكنة في فن الأيقونات البيزنطية، وهو فن مقدس تكون فيه كل خط صلاة وكل لون بياناً لاهوتياً.",
    quote:         '"عملي ليس إنشاء فن؛ بل هو الكشف عن النور الذي عاش لقرون داخل القوانين المقدسة."',
    bio2:          "متخصصة في تمبيرا البيض وورق الذهب عيار 24 قيراطاً، تزين أيقوناتها الكاتدرائيات والمجموعات الخاصة في الشرق الأوسط وأوروبا، محافظةً على تقليد يمتد لأكثر من ألفي عام.",
    handCaption:   "اليد التي ترسم المقدس",

    // Contact
    commissionWork: "اطلب عملاً فنياً",
    contact:        "تواصل",
    name:           "الاسم",
    email:          "البريد",
    yourName:       "اسمك",
    emailAddress:   "البريد الإلكتروني",
    subject:        "الموضوع",
    message:        "الرسالة",
    yourMessage:    "رسالتك",
    sendMessage:    "إرسال الرسالة",

    // Lightbox
    scrollZoom: "السكرول للتكبير · اسحب للتحريك",
    prev:       "السابق",
    next:       "التالي",

    // Footer
    copyright: "© 2024 دانا فواز دحدل",
  },
} as const;

export type LangT  = keyof typeof translations;
export type Trans  = typeof translations.en;