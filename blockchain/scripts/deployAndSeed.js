const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying BeeLedger contract to Sepolia...");
  const signers = await hre.ethers.getSigners();
  const admin = signers[0];
  
  // For the cloud demo, we will use the admin (deployer) wallet for all actions.
  // The contract allows Role.Admin to perform any stage update.

  const BeeLedger = await hre.ethers.getContractFactory("BeeLedger");
  const beeLedger = await BeeLedger.connect(admin).deploy();
  await beeLedger.waitForDeployment();

  const contractAddress = await beeLedger.getAddress();
  console.log(`BeeLedger deployed to: ${contractAddress}`);

  console.log("Saving contract metadata to backend and frontend...");
  const artifactPath = path.join(__dirname, "../artifacts/contracts/BeeLedger.sol/BeeLedger.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const contractData = {
    address: contractAddress,
    abi: artifact.abi,
  };

  const backendConfigPath = path.join(__dirname, "../../backend/contractData.json");
  const frontendConfigPath = path.join(__dirname, "../../frontend/src/contractData.json");
  
  fs.writeFileSync(backendConfigPath, JSON.stringify(contractData, null, 2));
  fs.writeFileSync(frontendConfigPath, JSON.stringify(contractData, null, 2));

  console.log("Seeding initial data using Admin role...");

  // Seed Batch 1: Completed successful batch
  let tx = await beeLedger.createBatch(
    "Ramesh Kumar", "HV-014", "2026-08-15", 45, 
    "Pending Testing", "Harvested mustard flower honey in Himachal Pradesh"
  );
  await tx.wait();
  console.log("Created Batch 1");

  tx = await beeLedger.addStageUpdate(
    1, "Lab Tested", "Punjab Agri Labs", "Sucrose 3.2%, Moisture 17%. Passed.", false, "Passed - Sucrose 3.2%, Moisture 17%"
  );
  await tx.wait();
  
  tx = await beeLedger.addStageUpdate(
    1, "Processed", "Himalayan Honey Processors", "Filtered and gently heated", false, ""
  );
  await tx.wait();
  
  tx = await beeLedger.addStageUpdate(
    1, "Packaged", "Himalayan Honey Processors", "Packaged into 500g glass jars", false, ""
  );
  await tx.wait();
  
  tx = await beeLedger.addStageUpdate(
    1, "Shipped to Retailer", "NatureFresh Logistics", "Shipped to Delhi outlets", true, ""
  );
  await tx.wait();
  console.log("Seeded history for Batch 1");

  // Seed Batch 2: Failed quality testing
  tx = await beeLedger.createBatch(
    "Suresh Singh", "HV-042", "2026-08-18", 30, 
    "Pending Testing", "Harvested multiflora honey"
  );
  await tx.wait();
  
  tx = await beeLedger.addStageUpdate(
    2, "Rejected - Failed Quality Test", "Punjab Agri Labs", "Adulteration detected. High sugar syrup content.", true, "Failed - Adulterated"
  );
  await tx.wait();
  console.log("Seeded history for Batch 2");

  // Seed Batch 3: In Progress
  tx = await beeLedger.createBatch(
    "Anita Devi", "HV-009", "2026-08-25", 60, 
    "Pending Testing", "Organic eucalyptus honey"
  );
  await tx.wait();
  
  tx = await beeLedger.addStageUpdate(
    3, "Lab Tested", "National Bee Board Lab", "Purity 100%, Passed", false, "Passed - Premium Grade"
  );
  await tx.wait();
  
  tx = await beeLedger.addStageUpdate(
    3, "Processed", "PureNectar Co.", "Cold filtered", false, ""
  );
  await tx.wait();
  console.log("Seeded history for Batch 3");

  console.log("Seeding complete! Blockchain is ready.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
