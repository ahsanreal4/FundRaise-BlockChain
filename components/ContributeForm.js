import { useState } from "react";

import { useRouter } from "next/router";

import getCampaignInstance from "../ethereum/campaign";
import web3 from "../ethereum/web3";

import { Button, Input, Form, Message } from "semantic-ui-react";

export default ({ campaignAddress }) => {
  const [amount, setAmount] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = await getCampaignInstance(campaignAddress);
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, "ether"),
      });
      router.replace(router.asPath);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleFormSubmit} error={!!errorMsg}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          placeholder="1"
          label="ether"
          labelPosition="right"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Form.Field>
      <Message error header="Something went wrong!" content={errorMsg} />
      <Button loading={loading} primary>
        Contribute!
      </Button>
    </Form>
  );
};
