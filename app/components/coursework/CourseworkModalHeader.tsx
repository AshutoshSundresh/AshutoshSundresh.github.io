import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { CHROME_MATERIAL, HAIRLINE, TOOLBAR_BUTTON, UI_FONT_STACK } from '../skeumorphic/macos';

interface CourseworkModalHeaderProps {
  onClose: () => void;
  children?: ReactNode;
}

/** Unified toolbar matching the main window: close at the leading edge,
 *  title centred, view controls trailing. */
export default function CourseworkModalHeader({ onClose, children }: CourseworkModalHeaderProps) {
  return (
    <div
      className={`relative flex h-[52px] shrink-0 items-center justify-between border-b px-4 ${HAIRLINE} ${CHROME_MATERIAL}`}
      style={{ fontFamily: UI_FONT_STACK }}
    >
      <button onClick={onClose} className={TOOLBAR_BUTTON} aria-label="Close coursework" title="Close">
        <X className="h-[16px] w-[16px]" strokeWidth={2} />
      </button>

      <div className="absolute left-1/2 hidden -translate-x-1/2 text-[13px] font-semibold text-[#1d1d1f] dark:text-white/90 md:block">
        Coursework
      </div>

      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}
