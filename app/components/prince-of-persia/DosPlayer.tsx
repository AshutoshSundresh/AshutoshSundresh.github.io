"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

interface DosPlayerProps {
  onClose: () => void;
}

export default function DosPlayer({}: DosPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const focusGame = () => {
      iframeRef.current?.focus();
      iframeRef.current?.contentWindow?.focus();
    };

    const timer = window.setTimeout(focusGame, 300);
    window.addEventListener("keydown", focusGame, true);
    window.addEventListener("pointerdown", focusGame, true);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", focusGame, true);
      window.removeEventListener("pointerdown", focusGame, true);
    };
  }, []);

  return (
    <div style={overlayStyle}>
      {isLoading && <div style={loadingStyle}>Loading...</div>}
      <iframe
        ref={iframeRef}
        title="PrinceJS"
        src="https://princejs.com/"
        allow="fullscreen; gamepad"
        allowFullScreen
        tabIndex={0}
        onLoad={() => setIsLoading(false)}
        style={iframeStyle}
      />
    </div>
  );
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  background: "#000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  paddingBottom: "14dvh",
};

const loadingStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#000",
  color: "#f3f3f3",
  fontFamily: "'Courier New', monospace",
  fontSize: "clamp(18px, 3vw, 34px)",
  fontWeight: 700,
  letterSpacing: 2,
  imageRendering: "pixelated",
  zIndex: 1,
};

const iframeStyle: CSSProperties = {
  width: "min(86vw, 840px)",
  height: "min(74dvh, 560px)",
  border: 0,
  background: "#000",
  display: "block",
  outline: "none",
  boxShadow: "0 24px 80px rgba(0,0,0,0.75)",
  zIndex: 2,
};
