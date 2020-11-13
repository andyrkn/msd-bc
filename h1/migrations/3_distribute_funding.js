const DistributeFunding = artifacts.require("DistributeFunding");

module.exports = function (deployer) {
    deployer.deploy(DistributeFunding);
  };
  