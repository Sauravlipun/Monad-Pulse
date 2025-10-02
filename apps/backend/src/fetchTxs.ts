export async function fetchTxsForAddress(web3: Web3, address: string, wsClients: Set<WebSocket>, maxBlocks: number = 10000): Promise<Transaction[]> {
  const latestBlock = await web3.eth.getBlockNumber();
  const txs: Transaction[] = [];
  let currentBlock = latestBlock;
  let noTxBlocks = 0;

  while (currentBlock >= 0 && noTxBlocks < 500) {
    if (wsClients.size > 0) {
      const progress = ((latestBlock - currentBlock) / maxBlocks) * 100;
      wsClients.forEach(client => client.send(JSON.stringify({ progress: Math.min(progress, 100) })));
    }
    // ... (rest of the function remains the same)
  }
  return txs.sort((a, b) => b.timestamp - a.timestamp);
}
