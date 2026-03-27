"use client";

import type { ReactNode } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function ThemeBoundary({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
