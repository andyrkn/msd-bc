const CrowdFunding = artifacts.require("CrowdFunding");

contract('CrowdFunding', (accounts) => {
    it('should be deployed with 100 goal', async () => {
        const instance = await CrowdFunding.deployed();

        const goal = await instance.getGoal();

        assert.equal(goal, 100);
    });

    it('should emit event with person whom contributed', async () => {
        const contributionValue = 20;
        const instance = await CrowdFunding.new(100);

        const result = await instance.contribute({ "value": contributionValue, "from": accounts[0] });
        const eventValue = result.logs[0].args;

        assert.equal(accounts[0], eventValue.identifier)
        assert.equal(contributionValue, eventValue.amount.words[0]);
    });

    it('should increase total sum after contribution', async () => {
        const contributionValue = 20;
        const instance = await CrowdFunding.new(100);

        await instance.contribute({ "value": contributionValue, "from": accounts[1] });
        await instance.contribute({ "value": contributionValue, "from": accounts[2] });

        const result = await instance.crowdFundingStatus();

        assert.equal(result.toNumber(), contributionValue + contributionValue);
    });

    it('should emit event when retracted', async () => {
        const contributionValue = 20;
        const retractionvalue = 10;
        const instance = await CrowdFunding.new(100);

        await instance.contribute({ "value": contributionValue, "from": accounts[1] });
        await instance.contribute({ "value": contributionValue, "from": accounts[2] });

        const retraction1 = await instance.retract(retractionvalue, { "value": 10, "from": accounts[1] });

        const eventValue = retraction1.logs[0].args;

        assert.equal(accounts[1], eventValue.identifier);
        assert.equal(retractionvalue, eventValue.amount.words[0]);
    });

    it('should reject additional contributions after goal reached', async () => {
        const contributionValue = 120;
        const instance = await CrowdFunding.new(100);

        await instance.contribute({ "value": contributionValue, "from": accounts[1] });
        try {
            await instance.contribute({ "value": 20, "from": accounts[2] });
            assert(false, "This should have failed");
        }
        catch (err) {
            assert(err);
        }

        const result = await instance.crowdFundingStatus();

        assert.equal(result.toNumber(), contributionValue);
    });

    it('should reject retractions after goal reached', async () => {
        const contributionValue = 120;
        const instance = await CrowdFunding.new(100);

        await instance.contribute({ "value": contributionValue, "from": accounts[1] });

        try {
            await instance.retract(40, { "value": 40, "from": accounts[1] });
            assert(false, "This should have failed");
        }
        catch (err) {
            assert(err);
        }

        const result = await instance.crowdFundingStatus();
        assert.equal(result.toNumber(), contributionValue);
    });
});