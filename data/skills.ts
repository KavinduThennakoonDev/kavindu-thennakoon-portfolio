/**
 * Technical skills. `icon` keys map to icons in components/sections/Skills.tsx.
 * Brand colors are used only as a subtle hover tint.
 */
export interface Skill {
  name: string;
  icon: string;
  color: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    title: "Languages",
    skills: [
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
      { name: "TypeScript", icon: "typescript", color: "#3178C6" },
      { name: "Python", icon: "python", color: "#3776AB" },
      { name: "Java", icon: "java", color: "#E76F00" },
      { name: "PHP", icon: "php", color: "#777BB4" },
      { name: "HTML", icon: "html", color: "#E34F26" },
      { name: "CSS", icon: "css", color: "#663399" },
      { name: "SQL", icon: "sql", color: "#38BDF8" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      { name: "Next.js", icon: "nextjs", color: "#FFFFFF" },
      { name: "React.js", icon: "react", color: "#61DAFB" },
      { name: "React Native", icon: "react", color: "#61DAFB" },
      { name: "Expo", icon: "expo", color: "#FFFFFF" },
      { name: "Tailwind CSS", icon: "tailwind", color: "#06B6D4" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    skills: [
      { name: "Node.js", icon: "nodejs", color: "#5FA04E" },
      { name: "Flask", icon: "flask", color: "#FFFFFF" },
      { name: "Mongoose", icon: "mongoose", color: "#F04D35" },
      { name: "Socket.io", icon: "socketio", color: "#FFFFFF" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    skills: [
      { name: "MySQL", icon: "mysql", color: "#4479A1" },
      { name: "Vitess", icon: "vitess", color: "#F16827" },
      { name: "MongoDB", icon: "mongodb", color: "#47A248" },
      { name: "Firebase", icon: "firebase", color: "#FFCA28" },
    ],
  },
  {
    id: "tools",
    title: "Tools & DevOps",
    skills: [
      { name: "Git", icon: "git", color: "#F05032" },
      { name: "GitHub", icon: "github", color: "#FFFFFF" },
      { name: "Docker", icon: "docker", color: "#2496ED" },
      { name: "Gunicorn", icon: "gunicorn", color: "#499848" },
      { name: "Cloudinary", icon: "cloudinary", color: "#3448C5" },
    ],
  },
];
