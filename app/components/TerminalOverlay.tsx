"use client";

import React from 'react';
import type { TerminalOverlayProps } from '../types';

export default function TerminalOverlay({
  isMobile,
  inputValue,
  onInputChange,
  onKeyDown,
  outputLines,
  inputRef,
}: TerminalOverlayProps) {
  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div>
          Ashutosh Terminal v1.0.0 {!isMobile && (
            <span className="terminal-hint">(Press ESC to exit)</span>
          )}
        </div>
      </div>
      <div className="terminal-output">
        {outputLines.map((line, index) => (
          <div key={index} className="terminal-output-line">
            {line}
          </div>
        ))}
      </div>
      <div className="terminal-prompt">
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
  );
}


