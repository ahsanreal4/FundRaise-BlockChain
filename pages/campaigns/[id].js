import { useRouter } from "next/router";

import Layout from "../../components/Layout";

export default () => {
  const router = useRouter();
  const campaignAddress = router.query.id;

  return (
    <Layout>
      <h1>{campaignAddress}</h1>
    </Layout>
  );
};
