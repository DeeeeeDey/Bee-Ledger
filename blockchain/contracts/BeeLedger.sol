// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BeeLedger {
    address public owner;

    enum Role { Admin, Beekeeper, Lab, Processor, Packager, Distributor }
    mapping(address => Role) public actorRoles;

    struct StageUpdate {
        string stageName;
        string actorName;
        uint256 timestamp;
        string notes;
    }

    struct Batch {
        uint256 batchId;
        string beekeeperName;
        string hiveId;
        string harvestDate;
        uint256 quantityKg;
        string qualityTestResult;
        string currentStage;
        bool isFinalized;
    }

    mapping(uint256 => Batch) public batches;
    mapping(uint256 => StageUpdate[]) public batchHistories;
    uint256 public batchCount;

    event BatchCreated(uint256 indexed batchId, string beekeeperName, string hiveId);
    event StageUpdated(uint256 indexed batchId, string stageName, string actorName);
    event RoleGranted(address indexed account, Role role);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyRole(Role _role) {
        require(actorRoles[msg.sender] == _role || actorRoles[msg.sender] == Role.Admin, "Access Denied: Incorrect Role");
        _;
    }

    constructor() {
        owner = msg.sender;
        actorRoles[msg.sender] = Role.Admin;
    }

    function grantRole(address _account, Role _role) public onlyOwner {
        actorRoles[_account] = _role;
        emit RoleGranted(_account, _role);
    }

    function createBatch(
        string memory _beekeeperName,
        string memory _hiveId,
        string memory _harvestDate,
        uint256 _quantityKg,
        string memory _qualityTestResult,
        string memory _notes
    ) public onlyRole(Role.Beekeeper) returns (uint256) {
        batchCount++;
        uint256 newBatchId = batchCount;

        batches[newBatchId] = Batch({
            batchId: newBatchId,
            beekeeperName: _beekeeperName,
            hiveId: _hiveId,
            harvestDate: _harvestDate,
            quantityKg: _quantityKg,
            qualityTestResult: _qualityTestResult,
            currentStage: "Harvested",
            isFinalized: false
        });

        batchHistories[newBatchId].push(StageUpdate({
            stageName: "Harvested",
            actorName: _beekeeperName,
            timestamp: block.timestamp,
            notes: _notes
        }));

        emit BatchCreated(newBatchId, _beekeeperName, _hiveId);
        emit StageUpdated(newBatchId, "Harvested", _beekeeperName);

        return newBatchId;
    }

    function addStageUpdate(
        uint256 _batchId,
        string memory _stageName,
        string memory _actorName,
        string memory _notes,
        bool _isFinalized,
        string memory _qualityTestResultUpdate
    ) public {
        require(_batchId > 0 && _batchId <= batchCount, "Invalid batch ID");
        require(!batches[_batchId].isFinalized, "Batch is already finalized");

        // Dynamic Role Checking based on the stage being added
        if (keccak256(abi.encodePacked(_stageName)) == keccak256(abi.encodePacked("Lab Tested")) || 
            keccak256(abi.encodePacked(_stageName)) == keccak256(abi.encodePacked("Rejected - Failed Quality Test"))) {
            require(actorRoles[msg.sender] == Role.Lab || actorRoles[msg.sender] == Role.Admin, "Access Denied: Requires Quality Lab Role");
        } else if (keccak256(abi.encodePacked(_stageName)) == keccak256(abi.encodePacked("Processed"))) {
            require(actorRoles[msg.sender] == Role.Processor || actorRoles[msg.sender] == Role.Admin, "Access Denied: Requires Processor Role");
        } else if (keccak256(abi.encodePacked(_stageName)) == keccak256(abi.encodePacked("Packaged"))) {
            require(actorRoles[msg.sender] == Role.Packager || actorRoles[msg.sender] == Role.Admin, "Access Denied: Requires Packager Role");
        } else if (keccak256(abi.encodePacked(_stageName)) == keccak256(abi.encodePacked("Shipped to Retailer"))) {
            require(actorRoles[msg.sender] == Role.Distributor || actorRoles[msg.sender] == Role.Admin, "Access Denied: Requires Distributor Role");
        }

        batchHistories[_batchId].push(StageUpdate({
            stageName: _stageName,
            actorName: _actorName,
            timestamp: block.timestamp,
            notes: _notes
        }));

        batches[_batchId].currentStage = _stageName;
        if (_isFinalized) {
            batches[_batchId].isFinalized = true;
        }
        
        // Allow updating quality results (e.g. after lab test)
        if (bytes(_qualityTestResultUpdate).length > 0) {
            batches[_batchId].qualityTestResult = _qualityTestResultUpdate;
        }

        emit StageUpdated(_batchId, _stageName, _actorName);
    }

    function getBatch(uint256 _batchId) public view returns (Batch memory) {
        require(_batchId > 0 && _batchId <= batchCount, "Invalid batch ID");
        return batches[_batchId];
    }

    function getBatchHistory(uint256 _batchId) public view returns (StageUpdate[] memory) {
        require(_batchId > 0 && _batchId <= batchCount, "Invalid batch ID");
        return batchHistories[_batchId];
    }
    
    function getAllBatches() public view returns (Batch[] memory) {
        Batch[] memory allBatches = new Batch[](batchCount);
        for (uint256 i = 1; i <= batchCount; i++) {
            allBatches[i - 1] = batches[i];
        }
        return allBatches;
    }
}
