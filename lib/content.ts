export type BikeModel = {
  id: string;
  name: string;
  subtitle: string;
  accent: string;
  accentHex: string;
  tintClass: string;
  description: string;
  glbPath: string;
  /* personality */
  mood: string;
  glowOpacity: string;
  bottomTint: string;
  titleSize: string;
  /* spec cards */
  card1: { label: string; value: string; detail: string };
  card2: { label: string; value: string; detail: string };
};

export const bikeModels: BikeModel[] = [
  {
    id: "vrod-night",
    name: "V-ROD NIGHT",
    subtitle: "Liquid-cooled. Street bred.",
    accent: "orange",
    accentHex: "#FF6B00",
    tintClass: "hue-rotate-0",
    description:
      "1250cc Revolution engine. Pure liquid-cooled performance forged for the asphalt.",
    glbPath: "/harley_davidson_v-rod_2001-2017.glb",
    mood: "SPEED",
    glowOpacity: "28",
    bottomTint: "#FF6B00",
    titleSize: "16.5vw",
    card1: { label: "POTENCIA",  value: "122 HP",   detail: "A 8,250 RPM" },
    card2: { label: "0–100 KPH", value: "3.8 SEGS", detail: "LIQUID-COOLED" },
  },
  {
    id: "iron-883",
    name: "IRON 883",
    subtitle: "Spartan. Unfiltered. Raw.",
    accent: "red",
    accentHex: "#FF0000",
    tintClass: "hue-rotate-[340deg]",
    description:
      "883cc Sportster engine. No frills, no chrome — just the machine stripped to its soul.",
    glbPath: "/harley_davidson_iron_883_2018.glb",
    mood: "REBEL",
    glowOpacity: "22",
    bottomTint: "#FF0000",
    titleSize: "20.5vw",
    card1: { label: "TORQUE",   value: "68 NM",    detail: "A 3,750 RPM" },
    card2: { label: "PESO",     value: "247 KG",   detail: "EN SECO" },
  },
  {
    id: "seventy-two",
    name: "SEVENTY-TWO",
    subtitle: "Vintage soul. Bobber stance.",
    accent: "gold",
    accentHex: "#D4881E",
    tintClass: "hue-rotate-[30deg]",
    description:
      "1202cc Sportster. Born from 1972. Teardrop tank, peanut seat, wide whitewall — the original rebel.",
    glbPath: "/harley-davidson_seventy-two_hd_fxt_2015.glb",
    mood: "VINTAGE",
    glowOpacity: "20",
    bottomTint: "#D4881E",
    titleSize: "13.5vw",
    card1: { label: "TORQUE",   value: "92 NM",    detail: "A 3,500 RPM" },
    card2: { label: "TANQUE",   value: "12.5 L",   detail: "TEARDROP 1972" },
  },
];

export const stats = [
  {
    label: "0–100 KPH",
    valueTo: "04 SECS+",
    countTarget: 4,
    suffix: " SECS+",
    prefix: "0",
  },
  {
    label: "ENGINE",
    valueTo: "1250 CC",
    countTarget: 1250,
    suffix: " CC",
    prefix: "",
  },
  {
    label: "TORQUE",
    valueTo: "115 NM",
    countTarget: 115,
    suffix: " NM",
    prefix: "",
  },
];

export const storySteps = [
  {
    number: "001",
    title: "Born from the street",
    body: "Every line on the V-Rod was dictated by the road. Not a showroom, not a sketch — the asphalt decided the geometry.",
  },
  {
    number: "002",
    title: "Built without compromise",
    body: "Porsche Engineering. DOHC liquid-cooled. 1250cc of pure revolution — a powertrain that refuses to apologize.",
  },
  {
    number: "003",
    title: "One colorway. Flat black.",
    body: "No chrome. No polish. Just matte obsidian and the hum of an engine that means business at every RPM.",
  },
];

export const siteConfig = {
  brand: "HARLEY DAVIDSON",
  tagline: "OWN THE DARK",
  ctaText: "CONFIGURE YOURS",
  limitedText: "Limited units. No waiting list.",
};
