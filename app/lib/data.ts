// ═══════════════════════════════════════════════
//  app/lib/data.ts
//  بيانات مشتركة بين كل الصفحات
// ═══════════════════════════════════════════════

export interface ArtItem {
  src: string;
  title: string;
  medium: string;
  dims: string;
  year: string;
  location: string;
}

export interface MuralItem {
  src: string;
  title: string;
  location: string;
  medium: string;
  size: string;
  year: string;
}

// ── Gallery Data ──────────────────────────────
export const galleryData: Record<string, ArtItem[]> = {
  icons: [
    { src: "/icons/icon1.jpg", title: "The Descent into Hades",  medium: "Egg Tempera & 24K Gold Leaf on Wood", dims: "45 × 60 cm",  year: "2021", location: "Private Collection, Beirut" },
    { src: "/icons/icon2.jpg", title: "Theotokos of the Sign",   medium: "Mineral Pigments on Gessoed Panel",   dims: "30 × 40 cm",  year: "2022", location: "Cairo, Egypt" },
    { src: "/icons/icon3.jpg", title: "Christ the High Priest",  medium: "Egg Tempera & 24K Gold Leaf on Wood", dims: "40 × 55 cm",  year: "2023", location: "Private Collection, Amman" },
    { src: "/icons/icon1.jpg", title: "The Holy Family",         medium: "Traditional Pigments on Canvas",       dims: "50 × 70 cm",  year: "2020", location: "Holy Family Church, Egypt" },
    { src: "/icons/icon2.jpg", title: "Saint George",            medium: "Egg Tempera on Lime Wood",            dims: "35 × 50 cm",  year: "2022", location: "St. George Church, Cairo" },
    { src: "/icons/icon3.jpg", title: "Archangel Gabriel",       medium: "Mineral Pigments & Gold Leaf",        dims: "40 × 55 cm",  year: "2023", location: "Private Collection, Paris" },
    { src: "/icons/icon1.jpg", title: "The Good Shepherd",       medium: "Egg Tempera on Gessoed Panel",        dims: "30 × 45 cm",  year: "2024", location: "Private Collection, London" },
    { src: "/icons/icon2.jpg", title: "Saint Catherine",         medium: "Traditional Byzantine Technique",     dims: "35 × 50 cm",  year: "2021", location: "St. Catherine's, Sinai" },
    { src: "/icons/icon3.jpg", title: "The Transfiguration",     medium: "Egg Tempera & Gold Leaf",             dims: "50 × 70 cm",  year: "2022", location: "Private Collection, Dubai" },
    { src: "/icons/icon1.jpg", title: "Our Lady of Sorrows",     medium: "Mineral Pigments on Wood",            dims: "40 × 60 cm",  year: "2023", location: "Private Collection, Beirut" },
    { src: "/icons/icon2.jpg", title: "Saint Anthony",           medium: "Egg Tempera on Lime Wood",            dims: "25 × 35 cm",  year: "2020", location: "St. Anthony's Monastery" },
    { src: "/icons/icon3.jpg", title: "The Nativity",            medium: "Traditional Pigments & Gold Leaf",    dims: "45 × 65 cm",  year: "2024", location: "Private Collection, Geneva" },
  ],
  gilding: [
    { src: "/icons/icon2.jpg", title: "The Flight into Egypt",      medium: "Traditional Pigments on Canvas",    dims: "60 × 80 cm",  year: "2022", location: "Cairo, Egypt" },
    { src: "/icons/icon3.jpg", title: "Saint Mark the Evangelist",  medium: "Egg Tempera & Gold Leaf",           dims: "35 × 50 cm",  year: "2023", location: "St. Mark's Cathedral, Cairo" },
    { src: "/icons/icon1.jpg", title: "The Nativity Scene",         medium: "Mineral Pigments on Gessoed Panel", dims: "40 × 60 cm",  year: "2021", location: "Private Collection, Paris" },
    { src: "/icons/icon2.jpg", title: "Saint Mary of Egypt",        medium: "Egg Tempera on Lime Wood",          dims: "25 × 35 cm",  year: "2024", location: "Private Collection, London" },
    { src: "/icons/icon3.jpg", title: "Golden Mandorla",            medium: "24K Gold Leaf & Egg Tempera",       dims: "50 × 70 cm",  year: "2022", location: "Private Collection, Amman" },
    { src: "/icons/icon1.jpg", title: "Sacred Halo Study",          medium: "Gold Leaf Engraving on Panel",      dims: "30 × 30 cm",  year: "2023", location: "Private Collection, Dubai" },
    { src: "/icons/icon2.jpg", title: "The Annunciation Gilt",      medium: "24K Gold Leaf on Gessoed Panel",    dims: "45 × 65 cm",  year: "2021", location: "Holy Family Church, Egypt" },
    { src: "/icons/icon3.jpg", title: "Byzantine Cross",            medium: "Gold Engraving on Wood",            dims: "20 × 30 cm",  year: "2024", location: "Private Collection, Beirut" },
    { src: "/icons/icon1.jpg", title: "Gilded Triptych",            medium: "Gold Leaf & Traditional Tempera",   dims: "80 × 60 cm",  year: "2020", location: "St. George Church, Cairo" },
  ],
  mosaic: [
    { src: "/icons/icon3.jpg", title: "The Annunciation",       medium: "Glass Mosaic Tesserae",     dims: "80 × 100 cm", year: "2023", location: "Private Collection, Dubai" },
    { src: "/icons/icon1.jpg", title: "Archangel Michael",      medium: "Stone & Glass Mosaic",      dims: "60 × 90 cm",  year: "2022", location: "St. Michael's, Jordan" },
    { src: "/icons/icon2.jpg", title: "The Resurrection",       medium: "Byzantine Glass Tesserae",  dims: "70 × 95 cm",  year: "2024", location: "Private Collection, Geneva" },
    { src: "/icons/icon3.jpg", title: "Holy Trinity",           medium: "Gold-backed Mosaic Tiles",  dims: "50 × 70 cm",  year: "2021", location: "Private Collection, Riyadh" },
    { src: "/icons/icon1.jpg", title: "The Last Supper Mosaic", medium: "Marble & Glass Tesserae",   dims: "120 × 80 cm", year: "2022", location: "St. George's Church, Cairo" },
    { src: "/icons/icon2.jpg", title: "Theotokos Mosaic",       medium: "Byzantine Glass Mosaic",    dims: "60 × 80 cm",  year: "2023", location: "Private Collection, Paris" },
    { src: "/icons/icon3.jpg", title: "Christ Pantocrator",     medium: "Gold Mosaic Tesserae",      dims: "90 × 120 cm", year: "2024", location: "St. Mary's Cathedral" },
    { src: "/icons/icon1.jpg", title: "Dove of Peace",          medium: "Marble Inlay & Glass",      dims: "40 × 40 cm",  year: "2021", location: "Private Collection, Beirut" },
  ],
};

// ── Various / Exhibitions ─────────────────────
export const variousWorks: ArtItem[] = [
  { src: "/icons/icon1.jpg", title: "Sacred Vessel",      medium: "Egg Tempera & 24K Gold Leaf on Wood", dims: "45 × 60 cm", year: "2021", location: "Private Collection, Beirut" },
  { src: "/icons/icon2.jpg", title: "The Pilgrim's Path", medium: "Mineral Pigments on Gessoed Panel",   dims: "30 × 40 cm", year: "2022", location: "Cairo, Egypt" },
  { src: "/icons/icon3.jpg", title: "Light of the East",  medium: "Egg Tempera & Gold Leaf on Wood",     dims: "40 × 55 cm", year: "2023", location: "Private Collection, Amman" },
  { src: "/icons/icon1.jpg", title: "Vessels of Silence", medium: "Traditional Pigments on Canvas",      dims: "50 × 70 cm", year: "2020", location: "Holy Family Church, Egypt" },
  { src: "/icons/icon2.jpg", title: "The Sacred Path",    medium: "Mineral Pigments on Panel",           dims: "35 × 50 cm", year: "2022", location: "Private Collection, Paris" },
  { src: "/icons/icon3.jpg", title: "Golden Hour",        medium: "Egg Tempera & Gold Leaf",             dims: "40 × 55 cm", year: "2023", location: "Private Collection, London" },
  { src: "/icons/icon1.jpg", title: "Byzantine Dreams",   medium: "Traditional Tempera on Wood",         dims: "30 × 45 cm", year: "2024", location: "Private Collection, Dubai" },
  { src: "/icons/icon2.jpg", title: "The Silent Prayer",  medium: "Mineral Pigments on Linen",           dims: "35 × 50 cm", year: "2021", location: "St. Mary's Cathedral" },
  { src: "/icons/icon3.jpg", title: "Celestial Gate",     medium: "Egg Tempera & 24K Gold Leaf",         dims: "50 × 70 cm", year: "2022", location: "Private Collection, Geneva" },
];

// ── Murals ────────────────────────────────────
export const muralsData: MuralItem[] = [
  { src: "/icons/icon1.jpg", title: "The Pantocrator Dome",    location: "St. Mary's Cathedral, Jordan",    medium: "Fresco Technique",         size: "120 sqm", year: "2021–2022" },
  { src: "/icons/icon2.jpg", title: "The Last Supper",         location: "St. George's Church, Cairo",      medium: "Acrylic on Plaster",       size: "85 sqm",  year: "2020" },
  { src: "/icons/icon3.jpg", title: "The Ascension",           location: "Holy Family Monastery, Egypt",    medium: "Fresco Secco",             size: "60 sqm",  year: "2023" },
  { src: "/icons/icon1.jpg", title: "Angels in the Sanctuary", location: "St. Bishoy Cathedral, Lebanon",   medium: "Gold Leaf & Fresco",       size: "45 sqm",  year: "2022" },
  { src: "/icons/icon2.jpg", title: "The Transfiguration",     location: "St. Anthony's Monastery, Egypt",  medium: "Mineral Pigments on Wall", size: "70 sqm",  year: "2019" },
  { src: "/icons/icon3.jpg", title: "The Nativity Dome",       location: "St. George's Cathedral, Beirut",  medium: "Fresco & Gold Leaf",       size: "95 sqm",  year: "2021" },
  { src: "/icons/icon1.jpg", title: "The Resurrection Wall",   location: "Holy Family Church, Cairo",       medium: "Fresco Secco",             size: "55 sqm",  year: "2022" },
  { src: "/icons/icon2.jpg", title: "Archangels Apse",         location: "St. Michael's, Jordan",           medium: "Mineral Pigments on Wall", size: "40 sqm",  year: "2023" },
  { src: "/icons/icon3.jpg", title: "The Annunciation Vault",  location: "St. Mary's Monastery, Egypt",     medium: "Fresco Technique",         size: "30 sqm",  year: "2024" },
  { src: "/icons/icon1.jpg", title: "Divine Liturgy",          location: "St. Bishoy Cathedral, Lebanon",   medium: "Acrylic on Plaster",       size: "110 sqm", year: "2020" },
];