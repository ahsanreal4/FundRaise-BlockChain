import React from "react";

import "semantic-ui-css/semantic.min.css";

import factory from "../ethereum/campaignFactory";
import Layout from "../components/Layout";
import { Card, Button } from "semantic-ui-react";

export const getServerSideProps = async () => {
  const deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
  return { props: { campaigns: deployedCampaigns } };
};

export default ({ campaigns }) => {
  const items = campaigns.map((address) => {
    return {
      header: address,
      description: <a>View Campaign</a>,
      fluid: true,
    };
  });

  const Campaigns = () => <Card.Group centered items={items} />;

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Button
          floated="right"
          content="Create Campaign"
          icon="add circle"
          primary
        />
        <Campaigns />
      </div>
    </Layout>
  );
};
