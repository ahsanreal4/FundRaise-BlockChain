import React from "react";

import factory from "../ethereum/campaignFactory";
import Layout from "../components/Layout";
import { Card, Button } from "semantic-ui-react";
import { useRouter } from "next/router";

export const getServerSideProps = async () => {
  const deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
  return { props: { campaigns: deployedCampaigns } };
};

export default ({ campaigns }) => {
  const router = useRouter();

  const items = campaigns.map((address) => {
    return {
      header: address,
      description: <a href={`/campaigns/${address}`}>View Campaign</a>,
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
          onClick={() => router.push("/campaigns/create")}
        />
        <Campaigns />
      </div>
    </Layout>
  );
};
