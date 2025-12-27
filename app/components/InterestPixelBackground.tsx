"use client";

import useIsMobile from '../hooks/useIsMobile';
import { useInterestIcons } from '../hooks/useInterestIcons';
import { useIconAnimation } from '../hooks/useIconAnimation';
import type { InterestName } from '../types/interestIcons';
import { ICON_ANIMATION_CONFIG } from '../constants/interestIcons';

interface InterestPixelBackgroundProps {
  interestName: InterestName;
}

export default function InterestPixelBackground({
  interestName,
}: InterestPixelBackgroundProps) {
  const isMobile = useIsMobile();
  const { iconSize, spacing, instanceCount } = ICON_ANIMATION_CONFIG;

  const { icons, iconsLoaded, canvasRef } = useInterestIcons({
    interestName,
    isMobile,
    iconSize,
    spacing,
    instanceCount,
  });

  useIconAnimation({
    canvas: canvasRef.current,
    icons,
    iconsLoaded,
    isMobile,
  });

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
}
