import web3 from "./web3";
import compaign from "./build/Campaign.json";

export default async (address) => {
  const instance = await new web3.eth.Contract(compaign.abi, address);

  return instance;
};
