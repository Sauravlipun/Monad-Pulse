import express from 'express';
import cors from 'cors';
import Web3 from 'web3';
import { Server as WebSocketServer } from 'ws';
import { fetchTxsForAddress } from './fetchTxs';

const app = express();
app.use(cors());
app.use(express.json());
const server = app.listen(process.env.PORT || 3001);
const wss = new WebSocketServer({ server });

const RPC_URL = process.env.RPC_URL || 'https://rpc.ankr.com/monad_testnet/e6eba22b1680c24f2930b917d009a35c4af3f9d5369a6c0f69e69cb2b15d5da8';
const web3 = new Web3(RPC_URL);

app.get('/health', (req, res) => res.send('OK'));

app.get('/api/txs/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const wsClients = new Set<WebSocket>();
    wss.clients.forEach(client => wsClients.add(client));
    const txs = await fetchTxsForAddress(web3, address.toLowerCase(), wsClients);
    res.json(txs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch txs' });
  }
});

console.log('Backend on', process.env.PORT || 3001);
