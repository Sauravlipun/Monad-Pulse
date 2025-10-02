# Monad-Pulse
Monad Pulse: Visualize all Monad Testnet transactions with dynamic particle flows, stats, and timelines, inspired by monadbft.live. Enter a wallet address to explore your full tx history from genesis in real-time with a sleek UI.

# Monad Wallet Flow

Enter a Monad Testnet address to visualize all transactions like monadbft.live: particle flow, stats, timeline. Fetches full history via RPC.

## Setup
1. `npm i` (root).
2. Local: `docker-compose up --build` (frontend:5173, backend:3001).

## Deploy
- Frontend: Vercel.
- Backend: Fly.io.

## Data
Fetches all txs from Ankr RPC (genesis to latest).

License: MIT
