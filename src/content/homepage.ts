import type { ProjectImage, SiteContent } from "./model";
export interface HomepageContent {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  footnote: string;
  sideNote: string;
  heroImage: ProjectImage;
  services: { title: string; description: string }[];
  communityEyebrow: string;
  communityHeading: string;
  communityAccent: string;
  communityDescription: string;
  communityButton: string;
  communityImage: ProjectImage;
  closingEyebrow: string;
  closingHeading: string;
  closingAccent: string;
  closingButton: string;
  closingNote: string;
  closingImage: ProjectImage;
}
export const defaultHomepage: HomepageContent = {
  eyebrow: "Practical solutions\nfor real businesses.",
  headline: "Good business.",
  headlineAccent: "Less busywork.",
  description: "Websites, automation, and workflow systems built around your business — so you can spend less time managing the work, and more time doing what you do best.",
  primaryLabel: "Let’s make room for better",
  secondaryLabel: "See what we can improve",
  footnote: "Rooted in Wisconsin. Built around you.",
  sideNote: "Real people.\nPractical technology.\nBrighter tomorrows.",
  heroImage: { src: "/assets/oak-landscape.webp", alt: "A mature oak spreading its canopy over a sunlit meadow.", width: 1536, height: 1024, caption: "" },
  services: [
    {title: "Websites", description: "Modern, effective websites that work for your business."},
    {title: "Automation", description: "Streamline everyday tasks with practical AI."},
    {title: "Workflow systems", description: "Tools that fit the way your business works."},
    {title: "Real support", description: "A partner who understands your world."},
  ],
  communityEyebrow: "Small business. Big possibilities.",
  communityHeading: "Technology that\nworks",
  communityAccent: "for you.",
  communityDescription: "We help small and growing businesses put AI and automation to work — without the complexity. From websites and lead capture to custom workflows and everyday tools, we design practical solutions that save time, prevent loss, and help you grow.",
  communityButton: "Explore our services",
  communityImage: { src: "/assets/main-street-preview.webp", alt: "Illustrative tree-lined Main Street with welcoming brick storefronts in warm afternoon light.", width: 1254, height: 1254, caption: "Strong businesses\nbuild stronger\ncommunities." },
  closingEyebrow: "Let’s build a more productive tomorrow.",
  closingHeading: "Ready to make\nroom",
  closingAccent: "for better?",
  closingButton: "Let’s talk",
  closingNote: "Simple conversation. Real possibilities.",
  closingImage: { src: "/assets/countryside-preview.webp", alt: "Illustrative rolling countryside at sunset.", width: 2048, height: 688, caption: "" },
};
// Older workspaces retain all saved projects/settings and use the approved layout defaults.
export function homepageFor(content: SiteContent): HomepageContent {
  return content.homepage ?? defaultHomepage;
}
export const homepageFieldGroups = [
  {title: "Opening section", fields: [
    ["eyebrow", "Small opening line", 120], ["headline", "Main headline", 60],
    ["headlineAccent", "Copper headline", 60], ["description", "Introduction", 600],
    ["primaryLabel", "Contact button text", 60], ["secondaryLabel", "AI finder link text", 60],
    ["footnote", "Wisconsin line", 140], ["sideNote", "Side note", 160],
  ]},
  {title: "Main Street section", fields: [
    ["communityEyebrow", "Small section line", 120], ["communityHeading", "Section headline", 100],
    ["communityAccent", "Copper headline ending", 60], ["communityDescription", "Section description", 1200],
    ["communityButton", "Services button text", 60],
  ]},
  {title: "Closing banner", fields: [
    ["closingEyebrow", "Small closing line", 120], ["closingHeading", "Closing headline", 100],
    ["closingAccent", "Copper headline ending", 60], ["closingButton", "Contact button text", 60],
    ["closingNote", "Line below the button", 160],
  ]},
] as const;
