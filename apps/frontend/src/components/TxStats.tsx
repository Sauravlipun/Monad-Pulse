import React from 'react';

interface Props { summary: { totalTxs: number; netValue: string; totalGas: number }; }

const TxStats: React.FC<Props> = ({ summary }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="p-4 bg-gray-800 rounded-lg text-center">
      <h3 className="text-lg font-semibold">Total Txs</h3>
      <p>{summary.totalTxs}</p>
    </div>
    <div className="p-4 bg-gray-800 rounded-lg text-center">
      <h3 className="text-lg font-semibold">Net Value</h3>
      <p>{summary.netValue} ETH</p>
    </div>
    <div className="p-4 bg-gray-800 rounded-lg text-center">
      <h3 className="text-lg font-semibold">Total Gas Used</h3>
      <p>{summary.totalGas}</p>
    </div>
  </div>
);

export default TxStats;
