"use client";

import { useCallback, useState } from 'react';

export default function usePinEntry(onSuccess: () => void) {
  const [password, setPassword] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const submit = useCallback(() => {
    if (parseInt(password, 10) === 10080) {
      setIsExiting(true);
      setTimeout(onSuccess, 300);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPassword('');
    }
  }, [password, onSuccess]);

  const press = useCallback((key: string) => {
    if (key === 'delete') {
      setPassword(prev => prev.slice(0, -1));
    } else if (key === 'cancel') {
      setPassword('');
    } else if (password.length < 5) {
      const next = password + key;
      setPassword(next);
      if (next.length === 5) {
        setTimeout(() => {
          if (parseInt(next, 10) === 10080) {
            setIsExiting(true);
            setTimeout(onSuccess, 300);
          } else {
            setIsShaking(true);
            setTimeout(() => { setIsShaking(false); setPassword(''); }, 500);
          }
        }, 300);
      }
    }
  }, [password, onSuccess]);

  return { password, isShaking, isExiting, submit, press };
}


