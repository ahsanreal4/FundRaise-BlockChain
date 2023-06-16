import { useMemo } from "react";

import { useRouter } from "next/router";

import getCampaignInstance from "../../../ethereum/campaign";
import Layout from "../../../components/Layout";
import ContributeFrom from "../../../components/ContributeForm";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../../ethereum/web3";

export const getServerSideProps = async (props) => {
  const campaignAddress = props.query.id;

  const campaign = await getCampaignInstance(campaignAddress);
  const summary = await campaign.methods.getSummary().call();
  let summaryObject = {
    minimumContribution: parseInt(summary[0].toString()),
    contractBalance: parseInt(summary[1].toString()),
    requestsCount: parseInt(summary[2].toString()),
    approversCount: parseInt(summary[3].toString()),
    managerAddress: summary[4],
  };

  return { props: { summary: summaryObject } };
};

export default ({ summary }) => {
  const {
    minimumContribution,
    contractBalance,
    requestsCount,
    approversCount,
    managerAddress,
  } = summary;
  const router = useRouter();
  const campaignAddress = router.query.id;

  const items = [
    {
      header: managerAddress,
      description:
        "The manager created this campaign and can create requests to withdraw money",
      meta: "Address of Manager",
      style: { overflowWrap: "break-word" },
    },
    {
      header: minimumContribution,
      description:
        "You must contribute at least this much wei to become an approver",
      meta: "Minimum Contribution (wei)",
    },
    {
      header: requestsCount,
      meta: "Number of Requests",
      description:
        "A request tries to withdraw money from the contract. Requests must be approved by the approvers",
    },
    {
      header: approversCount,
      meta: "Number of Approvers",
      description: "Number of people who have already donated to this campaign",
    },
    {
      header: web3.utils.fromWei(contractBalance, "ether"),
      meta: "Campaign Balance (ether)",
      description:
        "The balance is how much money this campaign has left to spend",
    },
  ];

  const campaignInformation = useMemo(
    () => <Card.Group items={items} />,
    [summary]
  );

  return (
    <Layout>
      <h3>Campaign Show</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{campaignInformation}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeFrom campaignAddress={campaignAddress} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Button
              primary
              onClick={() =>
                router.push(`/campaigns/${campaignAddress}/requests`)
              }
            >
              View Requests
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};
