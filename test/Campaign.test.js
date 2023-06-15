const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider());

const compiledCampaignFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let campaignFactory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  campaignFactory = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({
      data: compiledCampaignFactory.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "2000000" });

  await campaignFactory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "2000000" });

  const campaignAddresses = await campaignFactory.methods
    .getDeployedCampaigns()
    .call();

  campaignAddress = campaignAddresses[0];
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("Campaign Factory and Campaign contracts gets deployed", () => {
    assert(campaignFactory.options.address);
    assert(campaign.options.address);
  });

  it("Manager of the Campaign contract should be the creator of the contract", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("Allows people to contribute money and mark as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });

    const isApprover = await campaign.methods.approvers(accounts[1]).call();
    assert.equal(isApprover, true);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    const request = await campaign.methods.requests(0).call();
    assert.ok(request);
  });

  it("test complete flow", async () => {
    // Contribute to campaign
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    // Create a transfer request
    await campaign.methods
      .createRequest(
        "Buy batteries",
        web3.utils.toWei("5", "ether"),
        accounts[1]
      )
      .send({ from: accounts[0], gas: "1000000" });

    // Vote to approve transfer request
    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    // Finalize transfer request
    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    // Check if the amount is transferred correctly to account
    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
