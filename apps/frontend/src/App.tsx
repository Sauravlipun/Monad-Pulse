import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Transaction } from '../../../packages/shared/src';
import { useFetchTxs } from './hooks/useFetchTxs';
import TxStats from './components/TxStats';
import './index.css';

const App: React.FC = () => {
  const [address, setAddress] = useState('');
  const [progress, setProgress] = useState(0);
  const { txs, loading, progress: fetchProgress } = useFetchTxs(address, setProgress);
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    if (!sketchRef.current || txs.length === 0) return;

    p5Instance.current = new p5((p: p5) => {
      let particles: { x: number; y: number; vx: number; vy: number; color: string; value: number; tooltip: string }[] = [];

      p.setup = () => {
        p.createCanvas(p.windowWidth * 0.8, 400).parent(sketchRef.current!);
        p.background(26, 26, 46);
      };

      p.draw = () => {
        p.background(26, 26, 46, 50);
        particles.forEach((particle, i) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
          p.fill(particle.color);
          p.noStroke();
          p.ellipse(particle.x, particle.y, particle.value, particle.value);
          if (p.dist(p.mouseX, p.mouseY, particle.x, particle.y) < particle.value) {
            p.text(particle.tooltip, particle.x + 10, particle.y);
          }
        });
      };

      p.windowResized = () => p.resizeCanvas(p.windowWidth * 0.8, 400);

      txs.forEach((tx, i) => {
        particles[i] = {
          x: p.random(p.width),
          y: p.random(p.height),
          vx: p.random(-1, 1),
          vy: p.random(-1, 1),
          color: tx.to.toLowerCase() === address.toLowerCase() ? '#00ff00' : '#ff0000',
          value: Math.min(parseFloat(tx.value) * 10, 20) || 5,
          tooltip: `Tx: ${tx.hash.slice(0, 6)}... Value: ${tx.value} ETH`,
        };
      });
    });

    return () => p5Instance.current?.remove();
  }, [txs, address]);

  const summary = {
    totalTxs: txs.length,
    netValue: txs.reduce((acc, tx) => acc + (tx.to.toLowerCase() === address.toLowerCase() ? parseFloat(tx.value) : -parseFloat(tx.value)), 0).toFixed(4),
    totalGas: txs.reduce((acc, tx) => acc + tx.gasUsed, 0),
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-primary to-secondary">
      <h1 className="text-3xl font-bold mb-6 text-white">Monad Wallet Flow</h1>
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Enter Monad Testnet Address (0x...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 text-black"
        />
        <button onClick={() => {}} disabled={!address || loading} className="w-full p-3 bg-blue-600 text-white rounded-lg disabled:opacity-50">
          {loading ? 'Fetching...' : 'Visualize'}
        </button>
      </div>
      {loading && (
        <div className="mt-4 w-full max-w-md">
          <div className="bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-center mt-2">Scanning blocks ({progress}%)</p>
        </div>
      )}
      {txs.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <div ref={sketchRef} className="mb-4 border border-blue-500 rounded-lg overflow-hidden"></div>
          <TxStats summary={summary} />
        </div>
      )}
    </div>
  );
};

export default App;
