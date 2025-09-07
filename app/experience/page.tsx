"use client";
import { Suspense } from "react";
import ExperiencePage from "../components/ExperiencePage";

export default function Experience() {
  return (
    <Suspense fallback={null}>
      <ExperiencePage />
    </Suspense>
  );
}
