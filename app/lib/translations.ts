// app/lib/translations.ts

export type Lang = "en" | "ar";

interface T {
  // 🔥 Navbar
  navGallery: string;
  navMurals: string;
  navExhibitions: string;
  navAbout: string;
  navContact: string;

  // Lightbox / Gallery
  scrollZoom: string;
  prev: string;
  next: string;
  tabs: [string, string, string];
  selectedWorks: string;
  gallery: string;
  various: string;

  // Murals
  muralsLabel: string;
  andDomes: string;
  exploreMurals: string;

  // Hero
  sacredArt: string;
  role: string;

  // About
  philosophy: string;
  beyondVisible: string;
  bio1: string;
  bio2: string;
  quote: string;
  handCaption: string;

  // Contact
  commissionWork: string;
  contact: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  yourName: string;
  emailAddress: string;
  yourMessage: string;
  sendMessage: string;

  // Footer
  copyright: string;
}

export const translations: Record<Lang, T> = {
  en: {
    // 🔥 Navbar
    navGallery: "Works",
    navMurals: "Murals",
    navExhibitions: "Exhibitions & Various",
    navAbout: "About",
    navContact: "Contact",

    scrollZoom: "Scroll to zoom",
    prev: "Prev",
    next: "Next",
    tabs: ["Sacred Icons", "Gold Gilding", "Mosaics"],
    selectedWorks: "Selected Works",
    gallery: "Gallery",
    various: "Exhibitions & Various",

    muralsLabel: "Murals",
    andDomes: "& Church Domes",
    exploreMurals: "Explore Murals",

    sacredArt: "Sacred Art Since 2008",
    role: "Byzantine Iconographer · Damascus · Beirut",

    philosophy: "Philosophy",
    beyondVisible: "Beyond the Visible",
    bio1: "Dana Fawaz Dahdal is a Byzantine iconographer whose practice is rooted in the living tradition of Eastern Christian sacred art.",
    bio2: "Working from her studio, Dana creates commissions for churches and collectors across the Middle East and Europe.",
    quote: "The icon is not a portrait of the past — it is a window into the eternal present.",
    handCaption: "Dana Fawaz Dahdal — at work",

    commissionWork: "Commission Work",
    contact: "Contact",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    yourName: "Your full name",
    emailAddress: "your@email.com",
    yourMessage: "Tell me about the commission or inquiry...",
    sendMessage: "Send Message",

    copyright: "© 2025 Dana Fawaz Dahdal — All Rights Reserved",
  },

  ar: {
    // 🔥 Navbar
    navGallery: "الأعمال",
    navMurals: "الجداريات",
    navExhibitions: "معارض وأعمال متنوعة",
    navAbout: "عن الفنان",
    navContact: "تواصل",

    scrollZoom: "مرر للتكبير",
    prev: "السابق",
    next: "التالي",
    tabs: ["الأيقونات المقدسة", "التذهيب", "الفسيفساء"],
    selectedWorks: "أعمال مختارة",
    gallery: "المعرض",
    various: "معارض وأعمال متنوعة",

    muralsLabel: "الجداريات",
    andDomes: "والقباب الكنسية",
    exploreMurals: "استكشف الجداريات",

    sacredArt: "فن مقدس منذ ٢٠٠٨",
    role: "رسامة أيقونات بيزنطية · دمشق · بيروت",

    philosophy: "الفلسفة الفنية",
    beyondVisible: "ما وراء المرئي",
    bio1: "دانا فواز دحدل رسامة أيقونات بيزنطية.",
    bio2: "تنجز أعمالاً للكنائس والأديرة والمقتنين.",
    quote: "الأيقونة ليست صورة للماضي — بل نافذة على الحاضر الأبدي.",
    handCaption: "دانا فواز دحدل — في المرسم",

    commissionWork: "طلب عمل",
    contact: "تواصل",
    name: "الاسم",
    email: "البريد الإلكتروني",
    subject: "الموضوع",
    message: "الرسالة",
    yourName: "اسمك الكامل",
    emailAddress: "بريدك@الإلكتروني.com",
    yourMessage: "أخبريني عن طلبك أو استفسارك...",
    sendMessage: "إرسال الرسالة",

    copyright: "© ٢٠٢٥ دانا فواز دحدل — جميع الحقوق محفوظة",
  },
};