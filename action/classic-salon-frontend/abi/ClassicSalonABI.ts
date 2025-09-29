export const ClassicSalonABI = {
  abi: [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "workId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "reader",
        "type": "address"
      }
    ],
    "name": "WorkApplauded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "workId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "reader",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "genre",
        "type": "string"
      }
    ],
    "name": "WorkEndorsed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "workId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "contributor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      }
    ],
    "name": "WorkSubmitted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "workId",
        "type": "uint256"
      }
    ],
    "name": "applaudWork",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "workId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "genre",
        "type": "string"
      }
    ],
    "name": "endorseWorkInGenre",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "listAllWorks",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "ids",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextWorkId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "workId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "genre",
        "type": "string"
      }
    ],
    "name": "readEndorsements",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "votesHandle",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "workId",
        "type": "uint256"
      }
    ],
    "name": "readWork",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "contributor",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "synopsisHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "contentHash",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "tags",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "genres",
        "type": "string[]"
      },
      {
        "internalType": "uint64",
        "name": "timestamp",
        "type": "uint64"
      },
      {
        "internalType": "euint32",
        "name": "applauseHandle",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "synopsisHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "contentHash",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "tags",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "genres",
        "type": "string[]"
      }
    ],
    "name": "submitWork",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "workId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
};
