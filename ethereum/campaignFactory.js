import web3 from "./web3";
import compaignFactory from "./build/CampaignFactory.json";

const instance = await new web3.eth.Contract(
  compaignFactory.abi,
  "0x46b4b6Dc6EbaF7D8890cfA5cEc9e9462EEdbE595"
);

export default instance;
