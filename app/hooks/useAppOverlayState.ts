'use client';

import { create } from 'zustand';
import type { AppOverlayState } from '../types';

const useAppOverlayState = create<AppOverlayState>((set) => ({
  isTerminalActive: false,
  isLockscreenActive: false,
  isSearchActive: false,
  setTerminalActive: (active) => set({ isTerminalActive: active }),
  setLockscreenActive: (active) => set({ isLockscreenActive: active }),
  setSearchActive: (active) => set({ isSearchActive: active }),
}));

export default useAppOverlayState;
