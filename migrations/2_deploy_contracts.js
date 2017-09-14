var ICO = artifacts.require("./ICO.sol");

module.exports = function(deployer, network) {
  const team = "0x82127de2f739F4B02630cD93929A71A093C9D72D";
  const preICO = "0x6D85320c086aeE2eCD2693855fb2164c494fd251";
  const robot = "0x80e4568c84678367c30efa125bdd9ab6d65f2216";

  deployer.deploy(ICO, team, preICO, robot);
};
