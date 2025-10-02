import Web3 from 'web3';
import { Transaction } from '../../packages/shared/src';

export async function fetchTxsForAddress(web3: Web3, address: string): Promise<Transaction[]> {
  const latestBlock = await web3.eth.getBlockNumber();
  const txs: Transaction[] = [];
  let currentBlock = latestBlock;
  let noTxBlocks = 0;

  while (currentBlock >= 0 && noTxBlocks < 500) { // Stop if 500 blocks without txs
    const block = await web3.eth.getBlock(currentBlock, true);
    let foundTx = false;
    if (block && block.transactions) {
      for (const tx of block.transactions) {
        if (tx.from?.toLowerCase() === address || tx.to?.toLowerCase() === address) {
          txs.push({
            hash: tx.hash,
            from: tx.from || '',
            to: tx.to || '',
            value: web3.utils.fromWei(tx.value || '0', 'ether'),
            gasUsed: Number(tx.gas),
            timestamp: block.timestamp,
          });
          foundTx = true;
        }
      }
    }
    noTxBlocks = foundTx ? 0 : noTxBlocks + 1;
    currentBlock--;
    await new Promise(resolve => setTimeout(resolve, 50)); // Throttle
  }

  return txs.sort((a, b) => b.timestamp - a.timestamp);
}
