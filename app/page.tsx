import HomePageClient from "./components/HomePageClient";
import ThemeBoundary from "./components/ThemeBoundary";

export default function Home() {
  return (
    <ThemeBoundary>
      <HomePageClient />
    </ThemeBoundary>
  );
}