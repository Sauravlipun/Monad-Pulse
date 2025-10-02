import { useState, useEffect } from 'react';
import { Transaction } from '../../../packages/shared/src';

export const useFetchTxs = (address: string, setProgress: (p: number) => void) => {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setLocalProgress] = useState(0);

  useEffect(() => {
    if (!address) {
      setTxs([]);
      return;
    }
    setLoading(true);
    setLocalProgress(0);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/txs/${address}`)
      .then(res => res.json())
      .then(setTxs)
      .catch(err => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
    // Mock progress for demo - in real, backend could send progress via WS, but for simplicity, simulate
    const interval = setInterval(() => setLocalProgress(p => Math.min(p + 10, 100)), 500);
    return () => clearInterval(interval);
  }, [address]);

  useEffect(() => setProgress(progress), [progress]);

  return { txs, loading, progress };
};
