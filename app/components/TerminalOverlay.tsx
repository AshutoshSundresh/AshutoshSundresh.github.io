"use client";

import React, { useEffect } from 'react';
import type { TerminalOverlayProps } from '../types';

const PROMPT_STR = 'ashutosh@portfolio:~$ ';
const PROMPT_BARE = 'ashutosh@portfolio:~$';

function PromptSpans() {
  return (
    <>
      <span style={{ color: '#4ade80', fontWeight: 700 }}>ashutosh</span>
      <span style={{ color: '#1f4028' }}>@</span>
      <span style={{ color: '#4ade80', fontWeight: 500 }}>portfolio</span>
      <span style={{ color: '#1f4028' }}>:~</span>
      <span style={{ color: '#4ade80', marginRight: '0.45em', marginLeft: '0.05em' }}>$</span>
    </>
  );
}

function TerminalLine({ line }: { line: string }) {
  // Echoed command line — dark card with green left border
  if (line === PROMPT_BARE || line.startsWith(PROMPT_STR)) {
    const cmd = line.startsWith(PROMPT_STR) ? line.slice(PROMPT_STR.length) : '';
    return (
      <div style={{
        background: '#1a2e1a',
        borderRadius: '6px',
        padding: '0.35rem 0.75rem',
        margin: '0.3rem 0',
        borderLeft: '2px solid #238636',
        whiteSpace: 'pre',
        lineHeight: '1.6',
        display: 'flex',
        alignItems: 'center',
      }}>
        <PromptSpans />
        {cmd && <span style={{ color: '#f0f0f0', fontWeight: 500 }}> {cmd}</span>}
      </div>
    );
  }

  // Error messages
  if (
    line.startsWith('zsh:') ||
    line.startsWith('grep: no') ||
    line.startsWith('find: no') ||
    line.startsWith('No manual') ||
    line.startsWith('What manual') ||
    line.startsWith('cd: this is a web')
  ) {
    return (
      <div style={{
        color: '#f87171',
        background: '#2d1515',
        borderRadius: '4px',
        padding: '0.2rem 0.6rem',
        margin: '0.2rem 0',
        whiteSpace: 'pre',
        lineHeight: '1.6',
      }}>{line}</div>
    );
  }

  // Empty spacer
  if (line === '') return <div style={{ height: '0.65em' }} />;

  // Box-drawing banner lines
  if (line.startsWith('╔') || line.startsWith('║') || line.startsWith('╚')) {
    return <div style={{ color: '#34d058', whiteSpace: 'pre', lineHeight: '1.6', opacity: 0.85 }}>{line}</div>;
  }

  // ALL-CAPS section headers
  if (/^[A-Z][A-Z\s]{2,}(\s*\(.*\))?$/.test(line.trim())) {
    return <div style={{ color: '#fbbf24', fontWeight: 600, letterSpacing: '0.05em', whiteSpace: 'pre', lineHeight: '1.6' }}>{line}</div>;
  }

  // [ Category ] labels
  if (/^\[ .+ \]$/.test(line.trim())) {
    return <div style={{ color: '#60a5fa', fontWeight: 500, whiteSpace: 'pre', lineHeight: '1.6' }}>{line}</div>;
  }

  // Directory listing
  if (line.startsWith('drwxr-xr-x') || line.startsWith('total ')) {
    return <div style={{ color: '#4ade80', opacity: 0.5, whiteSpace: 'pre', lineHeight: '1.6' }}>{line}</div>;
  }

  // Result count
  if (/^\d+ (result|match|project|education|experience|activity|publication)/.test(line.trim())) {
    return <div style={{ color: '#a3e635', fontStyle: 'italic', whiteSpace: 'pre', lineHeight: '1.6' }}>{line}</div>;
  }

  return <div style={{ color: '#4ade80', whiteSpace: 'pre', lineHeight: '1.6' }}>{line}</div>;
}

export default function TerminalOverlay({
  isMobile,
  inputValue,
  onInputChange,
  onKeyDown,
  outputLines,
  inputRef,
  outputRef,
}: TerminalOverlayProps) {
  useEffect(() => {
    if (outputRef?.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputLines, outputRef]);

  return (
    <div
      className="terminal-container"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-header">
        <div className="terminal-header-title">
          <span style={{ color: '#4ade80', fontWeight: 700 }}>ashutosh</span>
          <span style={{ color: '#1f4028' }}> — </span>
          <span style={{ color: '#4ade80' }}>zsh</span>
        </div>
        {!isMobile && <span className="terminal-hint">ESC to exit</span>}
      </div>
      <div className="terminal-output" ref={outputRef}>
        {outputLines.map((line, index) => (
          <TerminalLine key={index} line={line} />
        ))}
        <div
          className="terminal-current-prompt"
          style={{
            borderTop: '1px solid #21262d',
            borderBottom: '1px solid #21262d',
            padding: '0.5rem 0',
            marginTop: '0.5rem',
          }}
        >
          <PromptSpans />
          <input
            type="text"
            className="terminal-input"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            ref={inputRef}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  );
}
