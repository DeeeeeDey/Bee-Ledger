# Bee Ledger - Blockchain Honey Traceability Demo

This is a complete, locally runnable demo for SIH 2026 demonstrating blockchain-based traceability for the honey supply chain.

## Prerequisites
- Node.js (v18+ recommended)
- npm

## How to Run the Demo (Single Command)

1. Open your terminal in this directory (`C:\Users\Debjit\.gemini\antigravity\scratch\bee-ledger`)
2. Run:
   ```bash
   npm run dev
   ```

This command will automatically:
1. Start a local Hardhat blockchain network.
2. Deploy the `BeeLedger.sol` smart contract.
3. Seed 5 realistic batches with stage histories.
4. Start the Express.js backend API (port 3001).
5. Start the React/Vite frontend (usually port 5173).

## Demo Flow

**1. The Internal Dashboard**
- Open the frontend URL (e.g. `http://localhost:5173`)
- You will see the supply chain dashboard showing the seeded batches.
- Click "New Batch" to log a new genesis record.
- Click the clipboard icon next to any unfinished batch to add a new step (e.g., "Lab Tested").
- **Visual Hook**: Notice the "Blockchain Activity" feed on the right updating in real-time as transactions are mined.

**2. The Consumer Experience (The Magic Moment)**
- Click the QR Code icon next to a completed batch (e.g., Batch #1) or scan the QR code that appears on the verify page.
- This represents what a consumer sees when they scan the jar in a store.
- **Visual Hook**: The large "Verified on Blockchain ✅" banner, along with the immutable timeline.
- Check out Batch #2 to see what a "Rejected - Failed Quality Test" looks like, proving the system also catches bad batches.

## Tech Stack
- **Blockchain**: Solidity, Hardhat, ethers.js
- **Backend**: Node.js, Express
- **Frontend**: React (Vite), Tailwind CSS, React Router, qrcode.react
