<div align="center"> 
  <h1>🍯 Bee Ledger</h1>
  <h3>Verified From Hive to Home</h3>
  <p>A blockchain-based traceability platform to eliminate honey adulteration and empower beekeepers.</p>
  <p>Built for Smart India Hackathon (SIH) 2026 — Problem Statement SIH26021 Ministry of Micro, Small & Medium Enterprises (MSME)</p>
  <p>
    <a href="https://bee-ledger-gold.vercel.app/">Live App</a> · 
    <a href="https://bee-ledger.onrender.com/">Backend API</a> · 
    <a href="#%EF%B8%8F-smart-contract">Smart Contract</a> · 
    <a href="#-how-to-run-locally">Run Locally</a>
  </p>
</div> 

## 📖 Overview
Bee Ledger is a decentralized traceability platform designed to eliminate honey adulteration and rebuild consumer trust in India's honey supply chain. By leveraging Ethereum smart contracts, the platform tracks every batch of honey — from the moment it's harvested at the hive to the moment it reaches a retail shelf.

Every stage update (Lab Testing → Processing → Packaging → Distribution) is immutably written to the blockchain, ensuring no single party — not a distributor, not a retailer, not even the platform operators — can quietly rewrite a batch's history to hide adulteration or misrepresent origin.

Consumers scan a QR code on the jar and instantly see the unforgeable, end-to-end history of their honey.

~14% of honey sold globally is estimated to be adulterated (European Commission Joint Research Centre). India, now the world's 2nd largest honey exporter, faces both a domestic trust problem and an export-credibility problem — Bee Ledger targets both.

## 🔗 Live Links
| Resource | Link |
|---|---|
| 🌐 Frontend (Vercel) | [bee-ledger-gold.vercel.app](https://bee-ledger-gold.vercel.app/) |
| ⚙️ Backend API (Render) | [bee-ledger.onrender.com](https://bee-ledger.onrender.com/) |
| ⛓️ Smart Contract (Sepolia) | [0x424B7DB4a0F631CFE22932FA35dE837Cf6B7dFB9](https://sepolia.etherscan.io/address/0x424B7DB4a0F631CFE22932FA35dE837Cf6B7dFB9) |

## 🐝 The Problem
Honey is one of the most adulterated food products in the world — sugar syrup blending, mislabeled origin, and fake "organic" claims are widespread and difficult for consumers to detect. Meanwhile, small and genuine beekeepers have no reliable way to prove the authenticity of their product, so they're forced to compete on price with cheaper, adulterated honey.

There's no trusted, tamper-proof system connecting the beekeeper at the hive to the consumer at the shelf.

## 💡 The Solution
Bee Ledger records every checkpoint in the honey supply chain as an immutable blockchain transaction, enforced by cryptographic role-based access control — meaning the smart contract itself rejects any attempt by the wrong actor to log a stage they're not authorized for.

```text
Beekeeper → Quality Lab → Processor → Packager → Distributor → Consumer
(Harvest)   (Test)        (Refine)    (Package)  (Ship)        (Verify)
└──────────────── all steps written immutably to Ethereum ────────────────┘
```

## 🛠 Tech Stack
Bee Ledger uses a modern, 3-tier Web3 architecture:

### 1️⃣ Frontend (Client Tier)
* **Framework:** React.js (powered by Vite)
* **Styling:** Tailwind CSS — custom "Honeycomb / Amber" design system
* **Animation:** Framer Motion for fluid transitions and micro-interactions
* **QR Scanning:** `html5-qrcode` for live in-browser scanning
* **Hosting:** Vercel

### 2️⃣ Backend (Middle Tier)
* **Framework:** Node.js & Express.js
* **Web3 Integration:** `ethers.js` (v6) — communicates with the blockchain so end users never need to install MetaMask or manage a wallet
* **Real-time Events:** `Socket.io` listens to on-chain contract events and pushes live updates to connected dashboards
* **Hosting:** Render.com

### 3️⃣ Blockchain (Data Tier)
* **Smart Contract:** Solidity v0.8.24
* **Network:** Ethereum Sepolia Testnet, deployed via Hardhat
* **RPC Gateway:** Alchemy Node API
* **Access Control:** Strict Role-Based Access Control (RBAC) — only the correct authorized actor can log a given stage

## ✨ Key Features
### 🔐 Cryptographic Role-Based Access Control (RBAC)
The smart contract defines distinct on-chain actor roles — Beekeeper, Quality Lab, Processor, Packager, Distributor — and actively reverts any transaction where the wrong actor attempts to log a stage (e.g. a Beekeeper cannot forge a "Lab Tested" result). This is enforced at the contract level, not just the UI.

### 📊 Role-Specific Dashboards
Each user logs into a dashboard tailored to their role in the supply chain. The UI automatically filters the global ledger to show only the batches currently actionable for that role.

### ⚡ Live WebSocket Event Feed
A real-time sidebar listens directly to the Ethereum blockchain. Whenever any actor updates a batch anywhere in the system, a `StageUpdated` event is emitted on-chain, caught by the Express backend, and broadcast instantly to every connected client.

### 📱 Consumer Verification & QR Scanning
No account needed. Consumers open the Verification page, scan the jar's QR code with their phone camera, and instantly see the full cryptographic timeline of that specific batch — including a "Rejected" state for batches that failed quality testing, shown honestly rather than hidden.

## 🔄 The Supply Chain Journey (End-to-End Flow)
| Stage | Actor | Action |
|---|---|---|
| 1️⃣ Harvest | 🐝 Beekeeper | Creates a new batch — logs Hive ID, weight, harvest date |
| 2️⃣ Quality Test | 🧪 Quality Lab | Runs purity tests (sucrose/moisture), marks Passed or Rejected. Rejected batches are permanently locked on-chain |
| 3️⃣ Processing | ⚙️ Processor | Logs filtration and gentle-heating metrics |
| 4️⃣ Packaging | 📦 Packager | Logs the jarring process, generates the final consumer-facing QR code |
| 5️⃣ Distribution | 🚚 Distributor | Logs final shipment details to retail, finalizing the batch |

## 🎨 Visual Identity
Bee Ledger follows a strict, cohesive design system:

| Element | Detail |
|---|---|
| Colors | Deep ambers, honey gold (`#F5A623`), wax beige (`#FAEBD0`) |
| Motifs | CSS-clipped hexagon shapes throughout the UI, reinforcing the honeycomb theme, alongside drifting SVG bee elements |
| Typography | Fraunces for warm, organic headings · Inter for clean UI/data readability · JetBrains Mono for cryptographic hashes |

## ⛓️ Smart Contract
* **Network:** Ethereum Sepolia Testnet
* **Address:** `0x424B7DB4a0F631CFE22932FA35dE837Cf6B7dFB9`
* **Language:** Solidity v0.8.24
* **Framework:** Hardhat

> ⚠️ **Note:** Sepolia is used here as a free public testnet for demonstration purposes. In a production deployment, end users (beekeepers, labs, etc.) would never interact with gas fees or wallets directly — the backend manages signing on their behalf, and the underlying network would move to a low-cost Layer 2 (e.g. Polygon) or a permissioned consortium chain operated by the relevant government body, removing public gas costs entirely.

## 🚀 How to Run Locally
If you need to spin up the project locally for judging, testing, or development:

1. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ../blockchain && npm install
   ```
2. **Run the full stack (single command)**
   ```bash
   npm run dev
   ```
   This uses `concurrently` to:
   * Boot a local Hardhat blockchain node
   * Seed it with demo batch data
   * Start the Express backend on `:3001`
   * Launch the Vite frontend on `:5173`
   
   *No internet dependency required for local demo mode — everything runs offline once dependencies are installed.*

## 📁 Project Structure
```text
bee-ledger/ 
├── frontend/    # React + Vite + Tailwind + Framer Motion 
├── backend/     # Node.js + Express + ethers.js + Socket.io 
├── blockchain/  # Solidity contracts + Hardhat config + deploy/seed scripts 
└── README.md
```

## 🗺️ Roadmap / Future Scope
- [ ] Migrate from Sepolia testnet to a low-cost Layer 2 (Polygon) or permissioned consortium chain for production
- [ ] Integrate with the government's existing Madhukranti Portal (National Bee Board) for beekeeper registration
- [ ] Add offline-first data entry for low-connectivity rural areas, with sync-on-reconnect
- [ ] Reputation/cross-verification layer for supply chain participants
- [ ] Multi-language support for beekeeper-facing screens

## 👥 Team
Built by **Bee Ledger** for Smart India Hackathon 2026.

<div align="center"> 
<br/>
Made with 🍯 for honest honey, honest beekeepers, and honest supply chains.
</div>
