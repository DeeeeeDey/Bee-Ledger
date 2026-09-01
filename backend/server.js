const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Load Contract Data
let contractData;
try {
  const dataPath = path.join(__dirname, 'contractData.json');
  contractData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (error) {
  console.error("Could not load contractData.json. Make sure to run deploy script first.");
  process.exit(1);
}

// Connect to Node (Local or Public Testnet)
// We use the SEPOLIA_URL if available, otherwise local
const rpcUrl = process.env.SEPOLIA_URL || 'http://127.0.0.1:8545';
const provider = new ethers.JsonRpcProvider(rpcUrl);

// For the hackathon testnet demo, we use the SAME private key for all roles
// This key must be the one that deployed the contract (which granted itself all roles).
const masterKey = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const getContractWithSigner = () => {
  const signer = new ethers.Wallet(masterKey, provider);
  return new ethers.Contract(contractData.address, contractData.abi, signer);
};

// Listen for events and broadcast via Socket.io
const defaultContract = getContractWithSigner();

defaultContract.on("BatchCreated", (batchId, beekeeperName, hiveId, event) => {
  io.emit('blockchain_event', {
    type: "BatchCreated",
    batchId: batchId.toString(),
    title: `New Batch #${batchId} Created`,
    description: `By ${beekeeperName} (Hive: ${hiveId})`,
    txHash: event.log.transactionHash,
    timestamp: new Date().toISOString()
  });
});

defaultContract.on("StageUpdated", (batchId, stageName, actorName, event) => {
  io.emit('blockchain_event', {
    type: "StageUpdated",
    batchId: batchId.toString(),
    title: `Batch #${batchId} Updated`,
    description: `${stageName} by ${actorName}`,
    txHash: event.log.transactionHash,
    timestamp: new Date().toISOString()
  });
});


// Helper to serialize BigInts
const serializeBatch = (b) => ({
  batchId: b.batchId.toString(),
  beekeeperName: b.beekeeperName,
  hiveId: b.hiveId,
  harvestDate: b.harvestDate,
  quantityKg: b.quantityKg.toString(),
  qualityTestResult: b.qualityTestResult,
  currentStage: b.currentStage,
  isFinalized: b.isFinalized
});

const serializeHistory = (h) => ({
  stageName: h.stageName,
  actorName: h.actorName,
  timestamp: h.timestamp.toString(),
  notes: h.notes
});


// API Routes
app.get('/api/batches', async (req, res) => {
  try {
    const batches = await defaultContract.getAllBatches();
    res.json(batches.map(serializeBatch));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/batches/:id', async (req, res) => {
  try {
    const batch = await defaultContract.getBatch(req.params.id);
    res.json(serializeBatch(batch));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/batches/:id/history', async (req, res) => {
  try {
    const history = await defaultContract.getBatchHistory(req.params.id);
    res.json(history.map(serializeHistory));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/batches', async (req, res) => {
  try {
    const { beekeeperName, hiveId, harvestDate, quantityKg, qualityTestResult, notes } = req.body;
    // We ignore roleId from frontend since we use the master key for the demo
    const contract = getContractWithSigner();
    const tx = await contract.createBatch(beekeeperName, hiveId, harvestDate, quantityKg, qualityTestResult, notes);
    const receipt = await tx.wait();
    res.json({ success: true, txHash: receipt.hash });
  } catch (err) {
    let msg = err.message;
    if (err.reason) msg = err.reason; // Gets the revert reason
    res.status(403).json({ error: msg });
  }
});

app.post('/api/batches/:id/stage', async (req, res) => {
  try {
    const { stageName, actorName, notes, isFinalized, qualityTestResultUpdate } = req.body;
    const contract = getContractWithSigner();
    const tx = await contract.addStageUpdate(
      req.params.id, stageName, actorName, notes || "", isFinalized || false, qualityTestResultUpdate || ""
    );
    const receipt = await tx.wait();
    res.json({ success: true, txHash: receipt.hash });
  } catch (err) {
    let msg = err.message;
    if (err.reason) msg = err.reason;
    res.status(403).json({ error: msg });
  }
});

// Real-time events are handled via sockets, but we can return 200 for health check
app.get('/api/events', (req, res) => {
  res.json({ status: "Use websocket to listen to events" });
});

app.get('/', (req, res) => {
  res.json({ status: "Bee Ledger Backend is Running" });
});

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
