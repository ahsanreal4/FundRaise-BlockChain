import Web3 from "web3";

let web3;

// We are in the browser and metamask is running
if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  web3 = new Web3(window.web3.currentProvider);
}
// We are on server or user is not running metamask
else {
  const provider = new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/b2c188a795e44ef7b9bf0b0982cf1eab"
  );
  web3 = new Web3(provider);
}

export default web3;
