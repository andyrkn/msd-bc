const DistributeFunding = artifacts.require("DistributeFunding");

contract('DistributeFunding', accounts => {
    it('should allow owner to add beneficiary', async () => {
        const instance = await DistributeFunding.new();
        const ratio = 10;
        const result = await instance.add(accounts[1], ratio, { "from": accounts[0] });

        assert.equal(accounts[1], result.logs[0].args.identifier);
        assert.equal(ratio, result.logs[0].args.ratio.words[0]);
    });

    it('should reject non-owner to add beneficiary', async () => {
        const instance = await DistributeFunding.new();
        const ratio = 10;
        
        try {
            const result = await instance.add(accounts[1], ratio, { "from": accounts[1] });
            console.log("passed");
            assert(false);
        }
        catch (_) { }
    });

    it('should route ratios correctly', async () => {
        const instance = await DistributeFunding.new();
        const ratio1 = 15;
        const ratio2 = 25;
        const sum = 120;

        const addition1 = await instance.add(accounts[1], ratio1, { "from": accounts[0] });
        const addition2 = await instance.add(accounts[2], ratio2, { "from": accounts[0] });

        const result = await instance.distribute({ "value": sum, "from": accounts[0] });

        assert.equal(accounts[1], result.logs[0].args.identifier);
        assert.equal(accounts[2], result.logs[1].args.identifier);

        assert.equal(Math.floor(ratio1 * 100 / sum), result.logs[0].args.amount.words[0]);
        assert.equal(Math.floor(ratio2 * 100 / sum), result.logs[1].args.amount.words[0]);
    });

    //https://stackoverflow.com/questions/52740950/how-to-send-wei-eth-to-contract-address-using-truffle-javascript-test
});