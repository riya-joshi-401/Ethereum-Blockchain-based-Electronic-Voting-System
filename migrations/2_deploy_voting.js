const Voting = artifacts.require("Voting");

module.exports = function (deployer) {
  deployer.deploy(Voting, ["Candidate A", "Candidate B", "Candidate C"]);
};
