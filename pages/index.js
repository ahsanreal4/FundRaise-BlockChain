import React, { useEffect, useState } from "react";
import factory from "../ethereum/campaignFactory";

export default () => {
  const [campaigns, setCampaigns] = useState([]);

  const getCampaigns = async () => {
    const deployedCampaigns = await factory.methods
      .getDeployedCampaigns()
      .call();

    console.log(deployedCampaigns);
    setCampaigns(deployedCampaigns);
  };

  useEffect(() => {
    getCampaigns();
  }, []);

  return <h1>Hello</h1>;
};
