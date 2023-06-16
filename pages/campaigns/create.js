import React, { useState } from "react";

import Layout from "../../components/Layout";
import factory from "../../ethereum/campaignFactory";
import web3 from "../../ethereum/web3";
import { useRouter } from "next/router";

import { Button, Input, Form, Message } from "semantic-ui-react";

const CreateCampaign = () => {
  const [minimumAmount, setMinimumAmount] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minimumAmount).send({
        from: accounts[0],
      });
      router.push("/");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={handleFormSubmit} error={!!errorMsg}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            placeholder="100"
            label="wei"
            labelPosition="right"
            value={minimumAmount}
            onChange={(e) => setMinimumAmount(e.target.value)}
          />
        </Form.Field>
        <Message error header="Something went wrong!" content={errorMsg} />
        <Button loading={loading} primary>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

export default CreateCampaign;
