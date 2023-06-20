import { Button } from "semantic-ui-react";

import getCampaignInstance from "../../../../ethereum/campaign";
import Layout from "../../../../components/Layout";
import { useRouter } from "next/router";

export const getServerSideProps = async (props) => {
  const campaignAddress = props.query.id;

  const campaign = await getCampaignInstance(campaignAddress);

  return { props: { summary: {} } };
};

export default () => {
  const router = useRouter();
  const campaignAddress = router.query.id;

  return (
    <Layout>
      <h3>Requests</h3>
      <Button
        primary
        onClick={() =>
          router.push(`/campaigns/${campaignAddress}/requests/new`)
        }
      >
        Add Request
      </Button>
    </Layout>
  );
};
