//PACKAGES SETUP
require("dotenv").config();
const express = require("express");
const http = require("http");
const ethers = require("ethers");
const PORT = process.env.PORT || 5000;
const app = express();

const ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
      { name: "_data", type: "bytes" },
    ],
    name: "transferAndCall",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_subtractedValue", type: "uint256" },
    ],
    name: "decreaseApproval",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_addedValue", type: "uint256" },
    ],
    name: "increaseApproval",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
      { indexed: false, name: "data", type: "bytes" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
];

var reserve = 1000000;

// WEB3 CONFIG
const ADDR = "0xD143291471D14beb2b6f2e57835302988Da49885";
const ADDR_POLY = "0xcaaC53A14F05156026c66a93283ebE61c399d904";
const ADDR_AVA = "0x6Fd29Ad556b13C4E57feCa61fafbc36C042944C4";

const providerSepolia = new ethers.providers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
);

const providerPolygon = new ethers.providers.JsonRpcProvider(
  `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`
);

const providerAvalanche = new ethers.providers.JsonRpcProvider(
  `https://avalanche-fuji.infura.io/v3/${process.env.INFURA_API_KEY}`
);

const signer = new ethers.Wallet(
  process.env.SIGNER_PRIVATE_KEY,
  providerSepolia
);

const contractSepolia = new ethers.Contract(ADDR, ABI, providerSepolia);
const contractPolygon = new ethers.Contract(ADDR_POLY, ABI, providerPolygon);
const contractAvalanche = new ethers.Contract(ADDR_AVA, ABI, providerAvalanche);

async function getLatestSupply() {
  const supplySepolia = await contractSepolia.totalSupply();
  const supplyPolygon = await contractPolygon.totalSupply();
  const supplyAvalanche = await contractAvalanche.totalSupply();

  console.log("*****************");
  console.log("Sepolia:", supplySepolia.toNumber());
  console.log("Polygon:", supplyPolygon.toNumber());
  console.log("Avalanche:", supplyAvalanche.toNumber());
  console.log("*****************");

  //const blockNumber = await providerSepolia.getBlockNumber();
  //console.log("Blocknumber: ", blockNumber);

  const totalSupply =
    supplySepolia.toNumber() +
    supplyPolygon.toNumber() +
    supplyAvalanche.toNumber();
  console.log("total:", totalSupply);

  if (totalSupply > reserve) {
    console.log("insufficient reserves");
  } else {
    console.log("Reserves Remaining", (reserve - totalSupply).toString());
    //Do something
    //   const functionSignatureHash = ethers.utils.id("mint()").slice(0, 10);
    /*
  const val = signer.sendTransaction({
    to: ADDR,
    data: functionSignatureHash,
    value: ethers.utils.parseUnits("0.00000001", "ether"),

  });
  */
  }
}

// Listen for Transfer events
/*
const init = async () => {
  contractTest.once("mintCheckEvent", (minter) => {
    test();
  });
};


init().catch((err) => {
  console.log(err);
  process.exit(1);
});
*/

getLatestSupply();

setInterval(async () => {
  await getLatestSupply();
}, 10000); //10 seconds
