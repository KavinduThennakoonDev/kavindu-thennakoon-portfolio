export interface Experience {
  role: string;
  company: string;
  period: string | null;
  current?: boolean;
  /** Secondary roles are shown compactly so they don't dominate engineering work. */
  secondary?: boolean;
  stack?: string[];
  responsibilities: string[];
}

export const experiences: Experience[] = [
  {
    role: "Associate Software Engineer",
    company: "Evoke Labs",
    period: "May 2024 — Present",
    current: true,
    stack: ["Next.js", "React", "Node.js", "TypeScript", "MySQL", "Vitess", "React Native", "Expo"],
    responsibilities: [
      "Develop and maintain enterprise-level microfinance and financial management web applications.",
      "Work extensively with Next.js, React, Node.js, TypeScript, and MySQL.",
      "Develop financial modules including Leasing, Bank Reconciliation, and Workflow Management.",
      "Engineer custom workflow automation solutions.",
      "Develop reusable frontend components and backend APIs.",
      "Work with Vitess/MySQL databases for transactional application data.",
      "Collaborate with Business Analysts, QA Engineers, and developers.",
      "Support deployment, troubleshooting, and application maintenance.",
      "Contribute to React Native application development using Expo.",
      "Participate throughout the Software Development Life Cycle.",
      "Author technical documentation for coding standards and project workflows.",
    ],
  },
  {
    role: "Fullstack Developer",
    company: "ICTA",
    period: "Oct 2023 — Apr 2024",
    stack: ["Next.js", "Node.js"],
    responsibilities: [
      "Partnered with microfinance companies to develop tailored financial solutions.",
      "Led development of a Finance ERP system using Next.js and Node.js.",
      "Contributed to the Sri Lanka eParticipation portal.",
    ],
  },
  {
    role: "Growth Strategist & Marketer",
    company: "NINE Digits",
    period: null,
    secondary: true,
    responsibilities: [
      "Formulate data-driven brand strategies.",
      "Execute Meta Ads and Google Ads campaigns.",
      "Conduct user research and SEO initiatives.",
      "Manage social media platforms for the company and its clients.",
    ],
  },
];
