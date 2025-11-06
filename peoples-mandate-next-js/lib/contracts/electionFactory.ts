export const electionFactoryContractAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "createElection",
    inputs: [
      { name: "_appId", type: "string", internalType: "string" },
      { name: "_action", type: "string", internalType: "string" },
      {
        name: "_electionInfo",
        type: "tuple",
        internalType: "struct Election.ElectionInfo",
        components: [
          { name: "startTime", type: "uint64", internalType: "uint64" },
          { name: "endTime", type: "uint64", internalType: "uint64" },
          { name: "name", type: "string", internalType: "string" },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
        ],
      },
      {
        name: "_candidates",
        type: "tuple[]",
        internalType: "struct Election.Candidate[]",
        components: [
          {
            name: "candidateId",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "name", type: "string", internalType: "string" },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
        ],
      },
      { name: "_ballotType", type: "uint256", internalType: "uint256" },
      { name: "_resultType", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "electionCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "factoryOwner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getElectionAddress",
    inputs: [{ name: "electionId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getElectionCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getElectionOwner",
    inputs: [{ name: "electionId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getFactoryOwner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ownerToElections",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "electionAddresses",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "publicElections",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "ElectionCreatedAddress",
    inputs: [
      {
        name: "electionAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ElectionCreatedInfo",
    inputs: [
      {
        name: "creator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "electionInfo",
        type: "tuple",
        indexed: true,
        internalType: "struct Election.ElectionInfo",
        components: [
          { name: "startTime", type: "uint64", internalType: "uint64" },
          { name: "endTime", type: "uint64", internalType: "uint64" },
          { name: "name", type: "string", internalType: "string" },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
        ],
      },
      {
        name: "candidates",
        type: "tuple[]",
        indexed: true,
        internalType: "struct Election.Candidate[]",
        components: [
          {
            name: "candidateId",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "name", type: "string", internalType: "string" },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "ElectionFactory_FactoryOwnerRestricted",
    inputs: [],
  },
  {
    type: "error",
    name: "ElectionFactory_InvalidCandidatesLength",
    inputs: [
      {
        name: "candidateLength",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  { type: "error", name: "FailedDeployment", inputs: [] },
  {
    type: "error",
    name: "InsufficientBalance",
    inputs: [
      { name: "balance", type: "uint256", internalType: "uint256" },
      { name: "needed", type: "uint256", internalType: "uint256" },
    ],
  },
];
