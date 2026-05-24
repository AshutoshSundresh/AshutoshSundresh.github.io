import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import "./fonts.css";
import Navigation from "./components/Navigation";
import portfolioData from "./data/skeumorphicExperienceData.json";
import { CONTACT, CONTACT_LINKS } from "./constants/contact";

const raleway = Raleway({
  subsets: ["latin"],
  display: "optional",
});

const siteUrl = new URL("https://ashutoshsundresh.com");
const siteOrigin = siteUrl.origin;
const personName = "Ashutosh Sundresh";

type PortfolioData = {
  projects: {
    name: string;
    caption: string;
    stats?: { label: string; value: string }[];
  }[];
  educationData: {
    institution: string;
    degree?: string;
    institutionLink?: string;
  }[];
  experienceData: {
    company: string;
    position: string;
  }[];
  awardsData: {
    awards: {
      title: string;
      highlight?: string;
    }[];
  }[];
};

const portfolio = portfolioData as PortfolioData;
const primaryEducation = portfolio.educationData[0];
const fellowship = portfolio.awardsData
  .flatMap((category) => category.awards)
  .find((award) => award.title.includes("Kleiner Perkins"));
const flagshipProject =
  portfolio.projects.find((project) => project.name.includes("ShapeShiftOS")) ??
  portfolio.projects[0];
const flagshipDownloads = flagshipProject?.stats?.find(
  (stat) => stat.label === "Downloads"
)?.value;
const experienceCompanies = portfolio.experienceData
  .slice(0, 4)
  .map((experience) => experience.company)
  .join(", ");
const currentRole = portfolio.experienceData[0];
const educationSummary = primaryEducation?.degree
  ? `${primaryEducation.degree} student at ${primaryEducation.institution}`
  : `student at ${primaryEducation?.institution}`;
const flagshipSummary = flagshipProject
  ? `Founder of ${flagshipProject.name}${
      flagshipDownloads ? ` (${flagshipDownloads} downloads)` : ""
    }.`
  : undefined;
const metadataDescription = [
  `Portfolio of ${personName}`,
  educationSummary,
  fellowship?.title,
  flagshipSummary,
  experienceCompanies ? `Experience at ${experienceCompanies}.` : undefined,
]
  .filter(Boolean)
  .join(" — ");
const openGraphDescription = [
  `Portfolio of ${personName}`,
  educationSummary,
  fellowship?.title,
  flagshipSummary,
]
  .filter(Boolean)
  .join(" — ");
const jsonLdDescription = [
  educationSummary,
  fellowship?.title,
  flagshipSummary,
].filter(Boolean).join(" ");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: personName,
  description: metadataDescription,
  openGraph: {
    title: personName,
    description: openGraphDescription,
    images: [
      {
        url: "/images/thumb.png",
        width: 1200,
        height: 630,
        alt: personName,
      },
    ],
    type: "website",
    url: siteOrigin,
  },
  twitter: {
    card: "summary_large_image",
    title: personName,
    description: openGraphDescription,
    images: ["/images/thumb.png"],
  },
  alternates: {
    canonical: siteOrigin,
    types: {
      "text/plain": `${siteOrigin}/llms.txt`,
    },
  },
  other: {
    "llms.txt": `${siteOrigin}/llms.txt`,
    "ai-readable-profile": `${siteOrigin}/llms.txt`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personName,
  url: siteOrigin,
  email: CONTACT.email,
  sameAs: CONTACT_LINKS,
  jobTitle: currentRole?.position ?? "Software Engineer",
  description: jsonLdDescription,
  alumniOf: primaryEducation && {
    "@type": "CollegeOrUniversity",
    name: primaryEducation.institution,
    url: primaryEducation.institutionLink,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // First thing in document so it runs before any head/body content is parsed. Sets .dark and data-theme so fallback CSS only applies before script runs.
  const themeScript = `(function(){var d=document,e=d.documentElement,t=localStorage.getItem('theme');var dark=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(dark){e.classList.add('dark');e.setAttribute('data-theme','dark');}else{e.classList.remove('dark');e.setAttribute('data-theme','light');}})();`;

  // Only before script runs (no data-theme): use system preference so hero never flashes white. After script: data-theme ensures correct background (light users on dark OS get white, not dark).
  // Hero-only: pills, buttons, cards, scrollbar and hero text so they paint dark on first paint (main[data-page="home"]).
  const themeFallback = `html:not([data-theme]) body,html:not([data-theme]) main{background-color:#fff}@media (prefers-color-scheme: dark){html:not([data-theme]) body,html:not([data-theme]) main{background-color:#1e1e1e}html:not([data-theme]) main[data-page=home]{scrollbar-color:#4b5563 #1e1e1e}html:not([data-theme]) main[data-page=home] button,html:not([data-theme]) main[data-page=home] a.rounded-full{background-color:rgba(42,42,42,.6);color:#e5e5e5;border-color:rgba(55,65,81,.5)}html:not([data-theme]) main[data-page=home] .w-px{background-color:#4b5563}html:not([data-theme]) main[data-page=home] div.rounded-full.border{border-color:rgba(55,65,81,.5)}html:not([data-theme]) main[data-page=home] .hero-pill-container{background-color:rgba(42,42,42,.6);border-color:rgba(55,65,81,.5)}html:not([data-theme]) main[data-page=home] .hero-pill-container button{background-color:transparent}html:not([data-theme]) main[data-page=home] .rounded-3xl.border{border-color:#374151}html:not([data-theme]) main[data-page=home] #hero-section span:not([class*="gradient"]){color:#e5e5e5}html:not([data-theme]) main[data-page=home] #hero-section a:not(.rounded-full){color:#9ca3af}}html[data-theme=light] body,html[data-theme=light] main{background-color:#fff}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeFallback }} />
        {/* Preload the hero font — it is on the critical render path (LCP text) */}
        <link rel="preload" href="/fonts/Array-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Preconnect to API origins used on first paint */}
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="preconnect" href="https://ws.audioscrobbler.com" />
        <link rel="preconnect" href="https://lastfm.freetls.fastly.net" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://ws.audioscrobbler.com" />
        <link rel="dns-prefetch" href="https://lastfm.freetls.fastly.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${raleway.className} antialiased`} suppressHydrationWarning>
        {children}
        <Navigation />
      </body>
    </html>
  );
}
