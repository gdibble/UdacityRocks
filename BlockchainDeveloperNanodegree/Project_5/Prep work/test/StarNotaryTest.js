const starDefinition = artifacts.require('StarNotary');

contract('StarNotary', accounts => {
    const owner = accounts[0];
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await starDefinition.new({from: owner});
    });

    describe('StaryNotary basics', () => {
        it('has correct name', async () => {
            assert.equal(await contractInstance.starName(), 'Awesome Udacity Star')
        });

        it('can be claimed', async () => {
            assert.equal(await contractInstance.starOwner(), 0);
            await contractInstance.claimStar({from: owner});
            assert.equal(await contractInstance.starOwner(), owner);
        });
    });

    describe('Star can change owners', () => {
        beforeEach(async () => {
            assert.equal(await contractInstance.starOwner(), 0);
            await contractInstance.claimStar({from: owner});
        });

        it('can be claimed by a second user', async () => {
            const secondUser = accounts[1];
            await contractInstance.claimStar({from: secondUser});

            assert.equal(await contractInstance.starOwner(), secondUser)
        });
    });
});
