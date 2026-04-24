export type Project = {
  name: string;
  href: string;
  meta: string;
  desc: string;
};

export type Job = {
  role: string;
  company: string;
  period: string;
  desc: string;
};

export type Book = {
  title: string;
  author: string;
  cover: { bg: string; fg?: string };
};

export const projects: Project[] = [
  {
    name: "Kaneo",
    href: "https://kaneo.app",
    meta: "2.4k★ · TypeScript, Go, Postgres",
    desc: "Open source project management platform focused on simplicity. Self-host it, customize it, make it yours.",
  },
  {
    name: "kaneo-cli",
    href: "https://github.com/usekaneo",
    meta: "Go",
    desc: "CLI tool to deploy your Kaneo instance with a single command. Because deployment should be simple.",
  },
  {
    name: "unwrapit",
    href: "#",
    meta: "TypeScript",
    desc: "See your most-listened Spotify artists and tracks at any time of the year — not just in December.",
  },
  {
    name: "spoti-cli",
    href: "#",
    meta: "Go",
    desc: "Control your Spotify player from the terminal. Because Alt-tabbing to skip a song is a crime.",
  },
  {
    name: "andrej.sh",
    href: "/",
    meta: "This site · Next.js",
    desc: "A small corner of the internet. Writing, projects, things I’m reading.",
  },
];

export const workHistory: Job[] = [
  {
    role: "Product Engineer",
    company: "Tolt",
    period: "2024 — now",
    desc: "Building affiliate marketing software for SaaS. Stripe, Paddle, and Chargebee integrations.",
  },
  {
    role: "Software Engineer",
    company: "CodeChem",
    period: "2022 — 2024",
    desc: "Frontend with React and TypeScript; backend with Node.js on AWS (Lambda, Cognito, DynamoDB).",
  },
  {
    role: "Open Source Contributor",
    company: "Chakra UI · Material UI",
    period: "2021 — now",
    desc: "Core collaborator on Chakra UI docs. Converted MUI components for CSS extraction.",
  },
];

export const reading: {
  current: Book[];
  finished: Book[];
} = {
  current: [
    {
      title: "The Art of Doing Science and Engineering",
      author: "Richard Hamming",
      cover: { bg: "#2e3a4e", fg: "#f5efdc" },
    },
    {
      title:
        "The Daily Stoic: 366 Meditations on Wisdom, Perseverance, and the Art of Living",
      author: "Ryan Holiday, Stephen Hanselman",
      cover: { bg: "#2a2a2a", fg: "#f5efdc" },
    },
  ],
  finished: [
    {
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki, Sharon Lechter",
      cover: { bg: "#8b2d1e", fg: "#f5efdc" },
    },
  ],
};
