const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const { ACCOUNT_MNEUMONIC, GOERLI_URL } = require("./constants");

const compiledCampaignFactory = require("./build/CampaignFactory.json");
const compiledCampaign = require("./build/Campaign.json");

const provider = new HDWalletProvider(ACCOUNT_MNEUMONIC, GOERLI_URL);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({ data: compiledCampaignFactory.evm.bytecode.object })
    .send({ gas: "2000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
