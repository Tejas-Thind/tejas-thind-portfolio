// One source of truth for the facts search engines and AI agents read about
// the site: metadata, JSON-LD, llms.txt, the feed and the sitemap all pull from
// here, so they never disagree with each other (or with what the pages say).

export const SITE_URL = "https://tejasthind.com";
export const SITE_NAME = "Tejas Thind";

export const SITE_DESCRIPTION =
  "Tejas Thind is a Management Engineering student at the University of Waterloo, joining Vercel as a software engineer intern in Winter 2027. Previously an AI Engineer intern at Theory Ventures, with software engineering internships at Clover Labs and Rootly AI.";

export const SOCIAL = {
  github: "https://github.com/Tejas-Thind",
  linkedin: "https://www.linkedin.com/in/tejas-thind/",
  x: "https://x.com/tejasthind4",
  instagram: "https://www.instagram.com/tejastnd/",
} as const;

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();

// The Person node, shared by the home page graph and by article authorship.
export const personNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Waterloo",
    url: "https://uwaterloo.ca/",
  },
  knowsAbout: [
    "Software engineering",
    "Artificial intelligence",
    "Retrieval and search systems",
    "Management engineering",
  ],
  sameAs: Object.values(SOCIAL),
} as const;
