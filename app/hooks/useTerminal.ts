"use client";

import { useEffect, useRef, useState } from 'react';

export default function useTerminal({
  isMobile,
  getLinesForCommand,
}: {
  isMobile: boolean;
  getLinesForCommand: (command: string) => string[] | null;
}) {
  const [terminalMode, setTerminalMode] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<string[]>([]);
  const historyIdxRef = useRef(-1);

  useEffect(() => {
    if (!terminalMode) return;
    setTerminalInput('');
    historyRef.current = [];
    historyIdxRef.current = -1;
    const loginTime = new Date().toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      year: 'numeric',
      hour12: false,
    });
    setTerminalOutput([
      'ashutosh-portfolio -- zsh -- 80x24',
      '',
      `Last login: ${loginTime} on ttys000`,
      '',
      'Type "help" for available commands.',
      '',
    ]);
    setTimeout(() => {
      if (terminalInputRef.current) {
        terminalInputRef.current.focus();
        if (isMobile) terminalInputRef.current.click();
      }
    }, 100);
  }, [terminalMode, isMobile]);

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
      const history = historyRef.current;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!history.length) return;
        const next = Math.min(historyIdxRef.current + 1, history.length - 1);
        historyIdxRef.current = next;
        setTerminalInput(history[history.length - 1 - next]);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = historyIdxRef.current - 1;
        historyIdxRef.current = next;
        setTerminalInput(next < 0 ? '' : history[history.length - 1 - next]);
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const partial = terminalInput.trimStart().toLowerCase();
        if (!partial) return;
        const completions = [
          'ls', 'ls projects', 'ls experience', 'ls education',
          'ls awards', 'ls publications', 'ls activities',
          'cat about.txt', 'cat resume.txt', 'cat skills.txt', 'cat contact.txt',
          'grep ', 'find ', 'whois', 'neofetch', 'uname', 'uname -a',
          'date', 'history', 'help', 'clear', 'pwd', 'echo ',
          'exit', 'quit', 'uptime', 'whoami', 'man ',
        ];
        const matches = completions.filter(c => c.startsWith(partial));
        if (matches.length === 1) {
          setTerminalInput(matches[0]);
        } else if (matches.length > 1) {
          setTerminalOutput(prev => [
            ...prev,
            `ashutosh@portfolio:~$ ${terminalInput}`,
            matches.join('    '),
            '',
          ]);
        }
        return;
      }

      if (e.key !== 'Enter') return;

      const raw = terminalInput;
      const trimmed = raw.trim();

      if (trimmed) {
        const h = historyRef.current;
        if (!h.length || h[h.length - 1] !== trimmed) {
          historyRef.current = [...h, trimmed];
        }
        historyIdxRef.current = -1;
      }

      setTerminalOutput(prev => [...prev, `ashutosh@portfolio:~$ ${raw}`]);
      setTerminalInput('');

      if (!trimmed) return;

      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const rest = parts.slice(1).join(' ');

      if (cmd === 'q' || cmd === 'exit' || cmd === 'quit') {
        setTerminalMode(false);
        return;
      }

      if (cmd === 'clear' || cmd === 'cls') {
        setTerminalOutput([]);
        return;
      }

      if (cmd === 'echo') {
        setTerminalOutput(prev => [...prev, rest, '']);
        return;
      }

      if (cmd === 'pwd') {
        setTerminalOutput(prev => [...prev, '/Users/ashutosh/portfolio', '']);
        return;
      }

      if (cmd === 'whoami') {
        setTerminalOutput(prev => [...prev, 'visitor', '']);
        return;
      }

      if (cmd === 'date') {
        setTerminalOutput(prev => [...prev, new Date().toString(), '']);
        return;
      }

      if (cmd === 'uname') {
        setTerminalOutput(prev => [
          ...prev,
          rest.includes('-a')
            ? 'Portfolio Darwin 24.3.0 Portfolio:1 arm64 arm i386 arm'
            : 'Portfolio',
          '',
        ]);
        return;
      }

      if (cmd === 'uptime') {
        const h = Math.floor(Math.random() * 48 + 1);
        const m = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        setTerminalOutput(prev => [
          ...prev,
          `${new Date().toLocaleTimeString()}  up ${h}:${m}, 1 user, load averages: 1.21 1.35 1.41`,
          '',
        ]);
        return;
      }

      if (cmd === 'history') {
        const h = historyRef.current;
        setTerminalOutput(prev => [
          ...prev,
          ...(h.length
            ? h.map((c, i) => `  ${String(i + 1).padStart(4)}  ${c}`)
            : ['(no history)']),
          '',
        ]);
        return;
      }

      if (cmd === 'help') {
        setTerminalOutput(prev => [
          ...prev,
          'COMMANDS',
          '',
          '  Navigation:',
          '    ls                         list all sections',
          '    ls <section>               list items in a section',
          '    find <name>                find by name',
          '    grep <term>                search all content',
          '',
          '  Files:',
          '    cat about.txt              about Ashutosh',
          '    cat resume.txt             resume summary',
          '    cat skills.txt             tech skills',
          '    cat contact.txt            contact info',
          '',
          '  Info:',
          '    whoami                     display current user',
          '    whois                      info about Ashutosh',
          '    neofetch                   system info with ASCII art',
          '    uname [-a]                 system name',
          '    date                       current date/time',
          '    uptime                     system uptime',
          '',
          '  Utilities:',
          '    echo <text>                print text',
          '    history                    command history',
          '    clear                      clear terminal',
          '    pwd                        print working directory',
          '    man <cmd>                  show manual page',
          '',
          '  Session:',
          '    exit / q / quit            exit terminal',
          '',
          'TIP: Use ↑↓ arrow keys for history, Tab for completion.',
          '',
        ]);
        return;
      }

      if (cmd === 'man') {
        const manPages: Record<string, string[]> = {
          ls: [
            'LS(1)', '',
            'NAME', '  ls -- list directory contents', '',
            'SYNOPSIS', '  ls [section]', '',
            'SECTIONS', '  projects  experience  education  awards  publications  activities',
          ],
          cat: [
            'CAT(1)', '',
            'NAME', '  cat -- display file contents', '',
            'SYNOPSIS', '  cat <file>', '',
            'FILES', '  about.txt  resume.txt  skills.txt  contact.txt',
          ],
          grep: [
            'GREP(1)', '',
            'NAME', '  grep -- search for pattern in content', '',
            'SYNOPSIS', '  grep <term>',
          ],
          find: [
            'FIND(1)', '',
            'NAME', '  find -- find entries by name', '',
            'SYNOPSIS', '  find <name>',
          ],
          neofetch: [
            'NEOFETCH(1)', '',
            'NAME', '  neofetch -- display system info with ASCII art', '',
            'SYNOPSIS', '  neofetch',
          ],
          whois: [
            'WHOIS(1)', '',
            'NAME', '  whois -- display information about Ashutosh', '',
            'SYNOPSIS', '  whois [ashutosh]',
          ],
        };
        const page = manPages[rest.toLowerCase()];
        if (page) {
          setTerminalOutput(prev => [...prev, ...page, '']);
        } else if (rest) {
          setTerminalOutput(prev => [...prev, `No manual entry for ${rest}`, '']);
        } else {
          setTerminalOutput(prev => [...prev, 'What manual page do you want?', '']);
        }
        return;
      }

      const lines = getLinesForCommand(trimmed.toLowerCase());
      if (lines !== null) {
        if (lines.length > 0) setTerminalOutput(prev => [...prev, ...lines, '']);
      } else {
        setTerminalOutput(prev => [...prev, `zsh: command not found: ${cmd}`, '']);
      }
    },
  };
}
