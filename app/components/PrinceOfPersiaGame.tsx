"use client";

import DosPlayer from "./prince-of-persia/DosPlayer";

export default function PrinceOfPersiaGame({ onClose }: { onClose: () => void }) {
  return <DosPlayer onClose={onClose} />;
}

