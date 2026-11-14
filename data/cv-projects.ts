/**
 * Projects listed on Kavindu's CV.
 *
 * Each entry is matched to its public GitHub repository by `repo`. When the
 * repository exists, these details ENRICH the GitHub data (curated title,
 * category, CV-confirmed technologies and features) so no duplicate card is
 * created. If a repository is ever made private or removed, the entry is
 * still shown as a manually configured project.
 */

export interface CvProject {
  repo: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  features?: string[];
  /** Used only when the repository is not publicly available. */
  fallbackUrl?: string;
  /** Source code is private — never link to GitHub for this project. */
  privateRepo?: boolean;
}

export const cvProjects: CvProject[] = [
  {
    repo: "Genix",
    title: "Genix Academy",
    category: "Full-Stack Development",
    description:
      "A training institute website and administrative management platform.",
    technologies: [
      "Next.js",
      "TypeScript",
      "MongoDB",
      "Cloudinary",
      "Tailwind CSS",
      "GSAP",
    ],
    features: [
      "Public course pages",
      "Course details",
      "Webinar pages",
      "Registration forms",
      "Protected admin dashboard",
      "Course management",
      "Webinar management",
      "Testimonial management",
      "Cloudinary image uploads",
      "Registration status tracking",
      "Signed-cookie authentication",
    ],
  },
  {
    repo: "Tenex-Coffee-Shop",
    title: "Tenex Coffee Shop",
    category: "Frontend Development",
    description: "A responsive coffee shop website frontend.",
    technologies: ["Tailwind CSS"],
  },
];

/**
 * Projects without a public repository, shown from this configuration only.
 * Technologies listed here were verified from the live site's production build.
 */
export const manualProjects: CvProject[] = [
  {
    repo: "luvora",
    title: "Luvora",
    category: "Frontend Development",
    description:
      "Website for Luvora, a bouquet shop — “Where Every Bouquet Speaks Love” — with bouquet showcases, testimonials and ordering.",
    technologies: ["React", "Vite"],
    fallbackUrl: "https://luvora-taupe.vercel.app/",
    privateRepo: true,
  },
];
