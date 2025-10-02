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
    const ws = new WebSocket(`${import.meta.env.VITE_API_URL?.replace('http', 'ws') || 'ws://localhost:3001'}/ws/progress`);
    ws.onmessage = (e) => setLocalProgress(JSON.parse(e.data).progress);
    ws.onclose = () => setLoading(false);

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/txs/${address}`)
      .then(res => res.json())
      .then(setTxs)
      .catch(err => console.error('Fetch error:', err))
      .finally(() => { ws.close(); setLoading(false); });

    return () => ws.close();
  }, [address]);

  useEffect(() => setProgress(progress), [progress]);

  return { txs, loading, progress };
};
