const CrowdFunding = artifacts.require("CrowdFunding");
const DistributeFunding = artifacts.require("DistributeFunding");

contract('CrowdFunding', (accounts) => {
    it('should transfer money and emit events', async () => {
        const cf = await CrowdFunding.new(100, { "from": accounts[0] });
        const df = await DistributeFunding.new({ "from": accounts[1] });

        //empty accounts
        await web3.eth.sendTransaction({from: accounts[3], to: accounts[6], value: 99999820000000000000});
        await web3.eth.sendTransaction({from: accounts[4], to: accounts[6], value: 99999820000000000000});

        for (let i = 0; i < 10; i++) {
            console.log(i, await web3.eth.getBalance(accounts[i]));
        }

        // add money in CF
        await cf.contribute({ "value": 100, "from": accounts[2] });

        // add two beneficiarys with ratios 10 and 20
        await df.add(accounts[3], 10, { "from": accounts[1] });
        await df.add(accounts[4], 20, { "from": accounts[1] });

        // await df.distribute({ "value": 100, "from": accounts[0] });
        
        const result = await cf.sendAway(accounts[1], { "from": accounts[0] });
        // console.log(result.logs);

        for (let i = 0; i < 10; i++) {
            console.log(i, await web3.eth.getBalance(accounts[i]));
        }

        assert(false);
    });
});