import web3 from "./web3";
import compaignFactory from "./build/CampaignFactory.json";

const instance = await new web3.eth.Contract(
  compaignFactory.abi,
  "0x0f20994B78dA046aD7ad013874847116066A467f"
);

export default instance;
