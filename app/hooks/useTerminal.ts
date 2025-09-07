"use client";

import { useEffect, useRef, useState } from 'react';

export default function useTerminal({ isMobile, getLinesForCommand }: { isMobile: boolean; getLinesForCommand: (command: string) => string[] | null }) {
  const [terminalMode, setTerminalMode] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalMode) {
      setTerminalInput('');
      setTerminalOutput([
        'Welcome to Ashutosh Terminal v1.0.0',
        '---------------------------------',
        'Available commands:',
        '  ls projects           - List all projects',
        '  ls education          - List all education entries',
        '  ls experience         - List all experience entries',
        '  ls awards             - List all awards',
        '  ls publications       - List all publications',
        '  ls activities         - List all activities',
        '  q                     - Exit terminal',
        '---------------------------------',
        'Type a command and press Enter:'
      ]);
      setTimeout(() => {
        if (terminalInputRef.current) {
          terminalInputRef.current.focus();
          if (isMobile) {
            terminalInputRef.current.focus();
            terminalInputRef.current.click();
          }
        }
      }, 100);
    }
  }, [terminalMode, isMobile]);

  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && terminalMode) {
        setTerminalMode(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [terminalMode]);

  return {
    terminalMode,
    setTerminalMode,
    terminalInput,
    setTerminalInput,
    terminalOutput,
    setTerminalOutput,
    terminalInputRef,
    terminalOutputRef,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      const command = terminalInput.trim().toLowerCase();
      // echo
      setTerminalOutput(prev => [...prev, `ashutosh@portfolio:~$ ${terminalInput}`]);
      if (command === 'q') {
        setTerminalMode(false);
        setTerminalInput('');
        return;
      }
      const lines = getLinesForCommand(command);
      if (lines && lines.length > 0) {
        setTerminalOutput(prev => [...prev, ...lines]);
      } else {
        setTerminalOutput(prev => [...prev, `Command not found: ${command}`]);
      }
      setTerminalInput('');
    }
  };
}


