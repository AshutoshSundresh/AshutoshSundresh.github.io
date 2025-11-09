import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import "./fonts.css";
import Navigation from "./components/Navigation";
import { ThemeProvider } from "./contexts/ThemeContext";

const raleway = Raleway({
  subsets: ["latin"],
  display: 'swap',
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
  return (
    <html lang="en">
      <body className={`${raleway.className} antialiased`}>
        <ThemeProvider>
          {children}
          <Navigation />
        </ThemeProvider>
      </body>
    </html>
  );
}
