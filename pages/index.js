import React from "react";
import factory from "../ethereum/campaignFactory";

export const getServerSideProps = async () => {
  const deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
  return { props: { campaigns: deployedCampaigns } };
};

export default ({ campaigns }) => {
  return <h1>{campaigns.length}</h1>;
};
