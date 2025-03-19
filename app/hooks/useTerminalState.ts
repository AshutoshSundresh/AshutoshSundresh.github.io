'use client';

import { create } from 'zustand';

interface TerminalState {
  isTerminalActive: boolean;
  setTerminalActive: (active: boolean) => void;
}

// Create a store for terminal state
const useTerminalState = create<TerminalState>((set) => ({
  isTerminalActive: false,
  setTerminalActive: (active) => set({ isTerminalActive: active }),
}));

export default useTerminalState;
