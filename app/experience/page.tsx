"use client";
import React from 'react';
import MacOSTimelineCard from "../components/SkeumorphicMacOSInterface";

export default function Experience() {
  return (
    <main className="h-screen overflow-y-auto flex items-center justify-center bg-gradient-to-b from-[#111111] to-[#0a0a0a] p-4 no-top-blur">
      <div className="max-w-6xl w-full mx-auto py-20">
        <MacOSTimelineCard />
      </div>
    </main>
  );
}
