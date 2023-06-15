const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// Get build folder path and delete the folder
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

// Get the path of Campaign.sol file and compile contracts
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");
const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Campaign.sol"
];

// Create build folder
fs.ensureDirSync(buildPath);

// Write contract to json files in build folder
for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract + ".json"),
    output[contract]
  );
}
