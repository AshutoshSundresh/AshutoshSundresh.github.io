"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

interface DosPlayerProps {
  onClose: () => void;
}

export default function DosPlayer({ onClose }: DosPlayerProps) {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasKeyboard, setHasKeyboard] = useState<boolean | null>(null);

  useEffect(() => {
    const detectKeyboardLikeDevice = () => {
      const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
      const hasHover = window.matchMedia("(any-hover: hover)").matches;
      const isSmallScreen = window.matchMedia("(max-width: 760px), (max-height: 560px)").matches;
      const touchPoints = navigator.maxTouchPoints ?? 0;

      setHasKeyboard(!isSmallScreen && ((hasFinePointer && hasHover) || touchPoints === 0));
    };

    const markKeyboardPresent = () => setHasKeyboard(true);

    detectKeyboardLikeDevice();
    window.addEventListener("keydown", markKeyboardPresent, true);
    window.addEventListener("resize", detectKeyboardLikeDevice);

    return () => {
      window.removeEventListener("keydown", markKeyboardPresent, true);
      window.removeEventListener("resize", detectKeyboardLikeDevice);
    };
  }, []);

  useEffect(() => {
    if (!hasKeyboard) return;

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
  }, [hasKeyboard]);

  if (hasKeyboard === false) {
    return (
      <div style={mobileFallbackStyle}>
        <SandpileCanvas />
        <div style={rotatingTextWrapStyle}>
          <div style={rotatingTextStyle}>COME BACK HERE ON DESKTOP FOR A SURPRISE</div>
        </div>
        <button
          type="button"
          onClick={() => {
            onClose();
            router.push("/experience");
          }}
          style={mobileOkButtonStyle}
        >
          OK 😢
        </button>
        <style>{`
          @keyframes prince-mobile-spin {
            0% { transform: rotateX(18deg) rotateY(-24deg) rotateZ(-2deg) scale(0.96); }
            50% { transform: rotateX(-10deg) rotateY(24deg) rotateZ(2deg) scale(1.04); }
            100% { transform: rotateX(18deg) rotateY(-24deg) rotateZ(-2deg) scale(0.96); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      {isLoading && <div style={loadingStyle}>Loading...</div>}
      <iframe
        ref={iframeRef}
        title="PrinceJS"
        src="https://princejs.com/"
        allow="fullscreen; gamepad"
        allowFullScreen
        scrolling="no"
        tabIndex={0}
        onLoad={() => setIsLoading(false)}
        style={iframeStyle}
      />
    </div>
  );
}

function SandpileCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let running = true;
    let dim = 0;
    let grid = new Uint8Array(1);
    const colors = new Uint8ClampedArray([
      0, 0, 0, 255,
      10, 30, 120, 255,
      214, 116, 16, 255,
      244, 244, 244, 255,
    ]);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      dim = Math.min(161, Math.max(81, Math.floor(Math.min(canvas.width, canvas.height) / 3)));
      if (dim % 2 === 0) dim -= 1;
      grid = new Uint8Array(dim * dim);
    };

    const topple = () => {
      const half = dim >> 1;
      const queue: number[] = [];
      const inQueue = new Uint8Array(dim * dim);
      const center = half * dim + half;

      grid[center] += 1;
      if (grid[center] >= 4) {
        queue.push(center);
        inQueue[center] = 1;
      }

      while (queue.length > 0) {
        const i = queue.shift()!;
        inQueue[i] = 0;
        if (grid[i] < 4) continue;

        const topples = grid[i] >> 2;
        grid[i] &= 3;
        const x = i % dim;
        const y = Math.floor(i / dim);
        const neighbors = [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ];

        for (const [nx, ny] of neighbors) {
          if (nx < 0 || nx >= dim || ny < 0 || ny >= dim) continue;
          const j = ny * dim + nx;
          grid[j] += topples;
          if (grid[j] >= 4 && inQueue[j] === 0) {
            queue.push(j);
            inQueue[j] = 1;
          }
        }
      }
    };

    const draw = () => {
      const image = ctx.createImageData(dim, dim);
      for (let i = 0; i < grid.length; i += 1) {
        const colorIndex = grid[i] * 4;
        const pixelIndex = i * 4;
        image.data[pixelIndex] = colors[colorIndex];
        image.data[pixelIndex + 1] = colors[colorIndex + 1];
        image.data[pixelIndex + 2] = colors[colorIndex + 2];
        image.data[pixelIndex + 3] = 255;
      }

      const offscreen = new OffscreenCanvas(dim, dim);
      const offscreenCtx = offscreen.getContext("2d");
      if (!offscreenCtx) return;

      offscreenCtx.putImageData(image, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const size = Math.min(canvas.width, canvas.height);
      const x = (canvas.width - size) / 2;
      const y = (canvas.height - size) / 2;
      ctx.drawImage(offscreen, x, y, size, size);
    };

    const tick = () => {
      if (!running) return;
      for (let i = 0; i < 160; i += 1) topple();
      draw();
      animationFrame = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    tick();

    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={sandpileCanvasStyle} />;
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
  overflow: "hidden",
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

const mobileFallbackStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  overflow: "hidden",
  background: "#000",
  perspective: 900,
};

const sandpileCanvasStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  imageRendering: "pixelated",
};

const rotatingTextWrapStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  pointerEvents: "none",
  transformStyle: "preserve-3d",
};

const rotatingTextStyle: CSSProperties = {
  maxWidth: 680,
  color: "#fff",
  fontFamily: "'Courier New', monospace",
  fontSize: "clamp(26px, 9vw, 78px)",
  fontWeight: 900,
  letterSpacing: 2,
  lineHeight: 0.95,
  textAlign: "center",
  textShadow: "4px 4px 0 #1b2cff, 8px 8px 0 #d66f00, 12px 12px 0 #111",
  textTransform: "uppercase",
  animation: "prince-mobile-spin 3.2s ease-in-out infinite",
  transformStyle: "preserve-3d",
};

const mobileOkButtonStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: "max(28px, env(safe-area-inset-bottom))",
  transform: "translateX(-50%)",
  zIndex: 2,
  background: "rgba(255,255,255,0.92)",
  color: "#111",
  border: "1px solid rgba(255,255,255,0.55)",
  borderRadius: 999,
  padding: "12px 22px",
  fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: 16,
  fontWeight: 750,
  letterSpacing: 0.2,
  cursor: "pointer",
  colorScheme: "light",
  boxShadow: "0 18px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.9)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

const iframeStyle: CSSProperties = {
  width: "min(86vw, 840px)",
  height: "min(74dvh, 560px)",
  border: 0,
  background: "#000",
  display: "block",
  overflow: "hidden",
  outline: "none",
  boxShadow: "0 24px 80px rgba(0,0,0,0.75)",
  zIndex: 2,
};
