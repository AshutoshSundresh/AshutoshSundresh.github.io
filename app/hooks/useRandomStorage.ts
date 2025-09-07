import { useCallback, useEffect, useState } from 'react';

export default function useRandomStorage(deps: unknown[] = []) {
  const [randomStorage, setRandomStorage] = useState('');

  const updateRandomStorage = useCallback(() => {
    const newStorage = (Math.floor(Math.random() * 990) / 10).toFixed(1);
    setRandomStorage(newStorage);
  }, []);

  useEffect(() => {
    updateRandomStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateRandomStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { randomStorage, updateRandomStorage };
}


