"use client";

import React, { useEffect } from 'react';
import type { TerminalOverlayProps } from '../types';

export default function TerminalOverlay({
  isMobile,
  inputValue,
  onInputChange,
  onKeyDown,
  outputLines,
  inputRef,
  outputRef,
}: TerminalOverlayProps) {
  // Auto-scroll to bottom whenever output changes
  useEffect(() => {
    if (outputRef?.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputLines, outputRef]);

  return (
    <div className="terminal-container bg-black/90 backdrop-blur-lg">
      <div className="terminal-header">
        <div>
          Ashutosh Terminal v1.0.0 {!isMobile && (
            <span className="terminal-hint">(Press ESC to exit)</span>
          )}
        </div>
      </div>
      <div className="terminal-output" ref={outputRef}>
        {outputLines.map((line, index) => (
          <div key={index} className="terminal-output-line">
            {line}
          </div>
        ))}
        {/* Current prompt as part of the thread */}
        <div className="terminal-current-prompt">
          <span className="terminal-prompt-text">ashutosh@portfolio:~$</span>
          <input
            type="text"
            className="terminal-input"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
}


