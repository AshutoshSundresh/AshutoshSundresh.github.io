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
  const themeScript = `
(function() {
  var s = typeof document !== 'undefined' && document.documentElement;
  if (!s) return;
  var t = localStorage.getItem('theme');
  if (t === 'dark') { s.classList.add('dark'); }
  else if (t === 'light') { s.classList.remove('dark'); }
  else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) { s.classList.add('dark'); }
  else { s.classList.remove('dark'); }
})();
  `.trim();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
