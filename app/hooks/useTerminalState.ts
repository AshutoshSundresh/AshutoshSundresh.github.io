'use client';

import { create } from 'zustand';
import type { AppOverlayState } from '../types';

// Create a store for terminal and lockscreen state
const useAppOverlayState = create<AppOverlayState>((set) => ({
  isTerminalActive: false,
  isLockscreenActive: false,
  setTerminalActive: (active) => set({ isTerminalActive: active }),
  setLockscreenActive: (active) => set({ isLockscreenActive: active }),
}));

export default useAppOverlayState;
