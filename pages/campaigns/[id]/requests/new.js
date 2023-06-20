import { useState } from "react";
import { useRouter } from "next/router";

import getCampaignInstance from "../../../../ethereum/campaign";
import Layout from "../../../../components/Layout";
import web3 from "../../../../ethereum/web3";

import { Button, Input, Form, Message, Icon } from "semantic-ui-react";

export default () => {
  const router = useRouter();
  const campaignAddress = router.query.id;

  const [formStates, setFormStates] = useState({
    value: "",
    description: "",
    recipient: "",
    loading: false,
  });
  const [errorMsg, setErrorMsg] = useState("");

  const setFormState = (key, value) => {
    const formValuesClone = { ...formStates };
    formValuesClone[key] = value;
    setFormStates(formValuesClone);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setFormState("loading", true);

    const campaign = await getCampaignInstance(campaignAddress);
    const { description, value, recipient } = formStates;

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
        });
      router.back();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setFormState("loading", false);
    }
  };

  return (
    <Layout>
      <div onClick={() => router.back()}>
        <Icon name="arrow left" link />
      </div>
      <h3>Create a Request</h3>
      <Form onSubmit={handleFormSubmit} error={!!errorMsg}>
        <Form.Field>
          <label>Description</label>
          <Input
            placeholder="Enter description..."
            value={formStates.description}
            onChange={(e) => setFormState("description", e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            placeholder="1"
            label="ether"
            labelPosition="right"
            value={formStates.value}
            onChange={(e) => setFormState("value", e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            placeholder="Enter recipient address..."
            value={formStates.recipient}
            onChange={(e) => setFormState("recipient", e.target.value)}
          />
        </Form.Field>
        <Message error header="Something went wrong!" content={errorMsg} />
        <Button loading={formStates.loading} primary>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};
