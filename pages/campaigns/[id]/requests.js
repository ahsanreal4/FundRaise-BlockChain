import { Button } from "semantic-ui-react";

import getCampaignInstance from "../../../ethereum/campaign";
import Layout from "../../../components/Layout";

export const getServerSideProps = async (props) => {
  const campaignAddress = props.query.id;

  const campaign = await getCampaignInstance(campaignAddress);

  return { props: { summary: {} } };
};

export default () => {
  return (
    <Layout>
      <h3>Requests</h3>
      <Button primary>Add Request</Button>
    </Layout>
  );
};
