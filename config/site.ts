/**
 * Central personal/brand configuration.
 * Everything that identifies Kavindu lives here so it can be changed in one place.
 */

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Kavindu Thennakoon",
  shortName: "Kavindu",
  initials: "KT",
  title: "Associate Software Engineer | Full-Stack Developer",
  roles: ["Associate Software Engineer", "Full-Stack Developer"],
  location: "Sri Lanka",
  timezone: "Asia/Colombo",
  experienceYears: "2+",
  email: "kavinduthennakoon222@gmail.com",
  phone: {
    display: "071 351 7222",
    href: "tel:+94713517222",
  },
  url: resolveSiteUrl(),
  description:
    "Software Engineer with 2+ years of experience in full-stack development, specializing in enterprise web applications, ERP systems, and financial applications for microfinance companies.",
  summary: [
    "Software Engineer with 2+ years of experience in full-stack development, specializing in enterprise web applications, ERP systems, and financial applications for microfinance companies.",
    "Experienced in building scalable web applications using Next.js, React, Node.js, TypeScript, and MySQL, including complex workflow management and automation modules.",
    "Strong at translating business requirements into practical software solutions and collaborating with cross-functional teams.",
  ],
  keywords: [
    "Kavindu Thennakoon",
    "Software Engineer",
    "Associate Software Engineer",
    "Full-Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Node.js",
    "TypeScript",
    "Enterprise Web Applications",
    "ERP Systems",
    "Microfinance Software",
    "Sri Lanka",
  ],
  social: {
    github: {
      username: "KavinduThennakoonDev",
      url: "https://github.com/KavinduThennakoonDev",
    },
    // Taken from the hyperlink inside Kavindu's CV PDF.
    linkedin: {
      url: "https://www.linkedin.com/in/kavindu-thennakoon-92a368216",
    },
  },
  /**
   * Portrait images. Drop the files into /public/images and set the paths.
   * Leave `null` to show the typographic monogram instead (no fake photos).
   *   hero:  tall portrait, ideally ≥ 1200px tall (4:5 ratio works best)
   *   about: optional secondary photo for the About section
   */
  images: {
    hero: "/images/kavindu-portrait.jpg" as string | null,
    about: null as string | null, // e.g. "/images/kavindu-working.jpg"
  },
  /**
   * The CV is served as-is from /public. Set `available: true` once the PDF
   * has been placed at public/cv/kavindu-thennakoon-cv.pdf.
   */
  cv: {
    href: "/cv/kavindu-thennakoon-cv.pdf",
    fileName: "Kavindu-Thennakoon-CV.pdf",
    available: true,
  },
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof navItems)[number]["id"];
