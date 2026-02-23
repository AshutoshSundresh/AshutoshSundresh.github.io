import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import "./fonts.css";
import Navigation from "./components/Navigation";
import { ThemeProvider } from "./contexts/ThemeContext";

const raleway = Raleway({
  subsets: ["latin"],
  display: 'optional',
});

export const metadata: Metadata = {
  title: "Ashutosh Sundresh",
  description: "Ashutosh Sundresh Portfolio Page",
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
  const themeFallback = `html:not([data-theme]) body,html:not([data-theme]) main{background-color:#fff}@media (prefers-color-scheme: dark){html:not([data-theme]) body,html:not([data-theme]) main{background-color:#1e1e1e}html:not([data-theme]) main[data-page=home]{scrollbar-color:#4b5563 #1e1e1e}html:not([data-theme]) main[data-page=home] button,html:not([data-theme]) main[data-page=home] a.rounded-full{background-color:rgba(42,42,42,.6);color:#e5e5e5;border-color:rgba(55,65,81,.5)}html:not([data-theme]) main[data-page=home] .w-px{background-color:#4b5563}html:not([data-theme]) main[data-page=home] div.rounded-full.border{border-color:rgba(55,65,81,.5)}html:not([data-theme]) main[data-page=home] .rounded-3xl.border{border-color:#374151}html:not([data-theme]) main[data-page=home] #hero-section span:not([class*="gradient"]){color:#e5e5e5}html:not([data-theme]) main[data-page=home] #hero-section a:not(.rounded-full){color:#9ca3af}}html[data-theme=light] body,html[data-theme=light] main{background-color:#fff}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeFallback }} />
      </head>
      <body className={`${raleway.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <Navigation />
        </ThemeProvider>
      </body>
    </html>
  );
}
