export const site = {
  name: "Renderlane",
  slogan: "Your lane to the web",
  description:
    "Renderlane is a web studio building immersive, high-performance websites with 3D, motion and Next.js — for brands that refuse to look basic.",
  // TODO: replace with your real contact details
  email: "hello@renderlane.com",
  phone: "+20 100 000 0000",
  location: "Cairo, Egypt — working worldwide",
  socials: [
    { label: "Instagram", href: "https://instagram.com/renderlane" },
    { label: "LinkedIn", href: "https://linkedin.com/company/renderlane" },
    { label: "Behance", href: "https://behance.net/renderlane" },
  ],
};

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export const capabilities = [
  "3D Websites",
  "Motion Design",
  "Next.js",
  "React Three Fiber",
  "Landing Pages",
  "E-commerce",
  "Web Apps",
  "Video Heroes",
  "UI / UX",
  "Performance",
];

export const services = [
  {
    title: "Immersive 3D websites",
    body: "Interactive 3D objects, product viewers and scroll-driven scenes that make visitors stop and play.",
    tags: ["Three.js", "WebGL", "R3F"],
    icon: "cube",
  },
  {
    title: "Motion & interaction",
    body: "Smooth scrolling, cinematic transitions and micro-interactions that make every click feel considered.",
    tags: ["GSAP", "Framer Motion", "Lenis"],
    icon: "motion",
  },
  {
    title: "Next.js development",
    body: "Fast, SEO-ready sites built on React and Next.js, with clean code your team can grow with.",
    tags: ["React", "Next.js", "TypeScript"],
    icon: "code",
  },
  {
    title: "Landing pages that convert",
    body: "Launch pages with video heroes and a clear story, designed to turn visitors into leads.",
    tags: ["Video", "Copy", "CRO"],
    icon: "launch",
  },
  {
    title: "E-commerce",
    body: "Storefronts with standout product pages — including 3D product views your customers can spin.",
    tags: ["Shopify", "Headless", "Payments"],
    icon: "cart",
  },
  {
    title: "Care & growth",
    body: "Monthly updates, speed checks and new features after launch, so your site keeps getting better.",
    tags: ["Hosting", "Updates", "Analytics"],
    icon: "spark",
  },
] as const;

export const processSteps = [
  {
    no: "01",
    title: "Discover",
    body: "A call to understand your business, audience and goals. We agree on scope, timeline and price — in writing.",
  },
  {
    no: "02",
    title: "Design",
    body: "Moodboards, layouts and motion concepts. You see the experience before a single line of code is written.",
  },
  {
    no: "03",
    title: "Build",
    body: "We develop in Next.js with weekly previews on a live link, so you can click through progress as it happens.",
  },
  {
    no: "04",
    title: "Launch & grow",
    body: "Testing on every device, a fast launch, and ongoing care so your site keeps performing.",
  },
];

// Concept projects (clearly labelled) until real case studies are ready.
export const projects = [
  {
    name: "Nile Heights",
    kind: "Real estate · Concept",
    blurb: "A 3D tower you can orbit, with floor plans that unfold on scroll.",
    art: "tower",
  },
  {
    name: "Aurum Watches",
    kind: "Luxury e-commerce · Concept",
    blurb: "A product page where the watch assembles itself as you scroll.",
    art: "rings",
  },
  {
    name: "Pulse Analytics",
    kind: "SaaS landing page · Concept",
    blurb: "Live-feeling charts and a video hero that explains the product in 8 seconds.",
    art: "wave",
  },
  {
    name: "Saffron Kitchen",
    kind: "Restaurant · Concept",
    blurb: "A menu that plates itself — dishes rotate in 3D as guests browse.",
    art: "orbit",
  },
] as const;

export const reasons = [
  { title: "Built by the founders", body: "You talk directly to the two people designing and coding your site. No account managers, no hand-offs." },
  { title: "Fast on every device", body: "3D and motion tuned for phones too, with performance budgets we check before launch." },
  { title: "SEO from day one", body: "Clean structure, metadata and speed that search engines reward." },
  { title: "Clear pricing", body: "Fixed quotes per package, a 50% deposit to start, and no surprise invoices." },
];

export const faqs = [
  {
    q: "How long does a website take?",
    a: "A landing page usually takes 1–2 weeks. A full company website with 3D and motion typically takes 3–6 weeks, depending on content and features.",
  },
  {
    q: "Will 3D make my site slow?",
    a: "No — we compress models, load 3D only when needed and provide lighter fallbacks for older phones, so the site stays fast.",
  },
  {
    q: "Do you work with clients outside Egypt?",
    a: "Yes. We work with clients across the Gulf, Europe and beyond, with calls in Arabic or English and pricing in USD.",
  },
  {
    q: "Can I edit the content myself?",
    a: "Yes. We can connect a simple CMS so your team can update text, images and projects without touching code.",
  },
];
