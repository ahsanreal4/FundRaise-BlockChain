import { useRouter } from "next/router";

import { Button, Table, Message, Tab } from "semantic-ui-react";

import getCampaignInstance from "../../../../ethereum/campaign";
import Layout from "../../../../components/Layout";
import web3 from "../../../../ethereum/web3";
import { useState } from "react";

export const getServerSideProps = async (props) => {
  const campaignAddress = props.query.id;

  const campaign = await getCampaignInstance(campaignAddress);
  const requestsCount = await campaign.methods.getRequestsCount().call();
  let approversCount = await campaign.methods.approversCount().call();
  approversCount = parseInt(approversCount);
  const requests = await Promise.all(
    Array(parseInt(requestsCount))
      .fill()
      .map(async (element, index) => {
        const request = await campaign.methods.requests(index).call();
        let requestObject = {
          description: request[0].toString(),
          value: parseInt(request[1].toString()),
          recipient: request[2],
          complete: request[3].toString().toLowerCase() === "true",
          approvalCount: parseInt(request[4].toString()),
        };
        return requestObject;
      })
  );

  return { props: { requests, campaignAddress, approversCount } };
};

export default ({ campaignAddress, requests, approversCount }) => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [approveButtonLoading, setApproveButtonLoading] = useState(false);
  const [finalizeButtonLoading, setFinalizeButtonLoading] = useState(false);

  const onApprove = async (id) => {
    setErrorMsg("");
    setApproveButtonLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = await getCampaignInstance(campaignAddress);
      await campaign.methods.approveRequest(id).send({ from: accounts[0] });
      router.replace(router.asPath);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setApproveButtonLoading(false);
    }
  };

  const onFinalize = async (id) => {
    setErrorMsg("");
    setFinalizeButtonLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = await getCampaignInstance(campaignAddress);
      await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
      router.replace(router.asPath);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setFinalizeButtonLoading(false);
    }
  };

  const RequestRow = ({ request, id }) => {
    const readyToFinalize = request.approvalCount > approversCount / 2;
    const canApprove = request.approvalCount >= approversCount;

    return (
      <Table.Row disabled={request.complete}>
        <Table.Cell>{id + 1}</Table.Cell>
        <Table.Cell>{request.description}</Table.Cell>
        <Table.Cell>{web3.utils.fromWei(request.value, "ether")}</Table.Cell>
        <Table.Cell>{request.recipient}</Table.Cell>
        <Table.Cell>
          {request.approvalCount} / {approversCount}
        </Table.Cell>
        <Table.Cell>
          {request.complete ? null : (
            <Button
              color={canApprove ? "grey" : "green"}
              loading={approveButtonLoading}
              basic
              onClick={() => onApprove(id)}
              disabled={canApprove}
            >
              Approve
            </Button>
          )}
        </Table.Cell>
        <Table.Cell>
          {request.complete ? null : (
            <Button
              basic
              color={readyToFinalize ? "teal" : "grey"}
              loading={finalizeButtonLoading}
              onClick={() => onFinalize(id)}
              disabled={!readyToFinalize}
            >
              Finalize
            </Button>
          )}
        </Table.Cell>
      </Table.Row>
    );
  };

  const getTableRows = () => {
    return requests.map((request, index) => (
      <RequestRow request={request} key={index} id={index} />
    ));
  };

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
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {getTableRows()}
          {requests.length === 0 && (
            <Table.Row>
              <Table.Cell>No requests to show</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      {errorMsg && errorMsg.length > 0 ? (
        <Message error header="Something went wrong!" content={errorMsg} />
      ) : null}
    </Layout>
  );
};
