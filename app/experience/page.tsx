import { Suspense } from "react";
import ExperiencePage from "../components/ExperiencePage";
import ThemeBoundary from "../components/ThemeBoundary";

export default function Experience() {
  return (
    <Suspense fallback={null}>
      <ThemeBoundary>
        <ExperiencePage />
      </ThemeBoundary>
    </Suspense>
  );
}
