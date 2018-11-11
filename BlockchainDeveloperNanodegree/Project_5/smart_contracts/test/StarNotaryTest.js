/*global artifacts,assert,beforeEach,contract,describe,it,web3*/
'use strict';
// Smart Contract:
const StarNotary = artifacts.require('StarNotary');
// Ref: Messier objects via https://en.wikipedia.org/wiki/List_of_Messier_objects


contract('StarNotary - Tests with Globular Clusters', accounts => {

  // Accounts/users and Star Price (Wei)
  const defaultAccount = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  // const randomMaliciousUser = accounts[3];
  const starPrice = web3.toWei(0.01, 'ether');


  beforeEach(async () => {
    this.contract = await StarNotary.new({ from:defaultAccount });
  });


  // Tests initated with defaultUser
  describe('defaultUser Tests', () => {

    // Create Star / Read Info
    describe('Star creation and meta', () => {

      it('defaultAccount can create M1 and read its meta', async () => {
        await this.contract.createStar('M1', 'dec_52.2', 'mag_8.4', 'ra_31.94', 'NGC 1952: Crab Nebula', { from:defaultAccount });
        assert.deepEqual(await this.contract.tokenIdToStarInfo(1), [ 'M1', 'NGC 1952: Crab Nebula', 'ra_31.94', 'dec_52.2', 'mag_8.4' ]);
      });

    });


    // Validate if star exists in registry
    describe('defaultAccount can checkIfStarExist <-- `true`', () => {

      it('defaultAccount: star exists', async () => {
        await this.contract.createStar('M12', 'dec_54.7', 'mag_7.7', 'ra_14.18', 'NGC 6218', { from:defaultAccount });
        assert.equal(await this.contract.checkIfStarExist('dec_54.7', 'mag_7.7', 'ra_14.18'), true);
      });

    });


    // Ensure `approve` & `getApproved` are working
    describe('Testing `approve` && `getApproved`', async () => {

      it('defaultAccount: approve and getApproved', async () => {
        // M15 creation by defaultAccount
        await this.contract.createStar('Star power 103!', 'dec_121.874', 'mag_245.978', 'ra_032.155', 'I love my wonderful star', { from:defaultAccount });
        // M15 address approval
        await this.contract.approve(user1, 1, { from:defaultAccount });
        // M15 approved address
        assert.equal(await this.contract.getApproved(1, { from:defaultAccount }), user1);
      });

    });


    // Approve M19/M22 and verify that both are approved
    describe('Testing `setApprovalForAll` && `isApprovedForAll`', async () => {

      it('defaultAccount: setApprovalForAll and isApprovedForAll', async () => {
        // M19/M22 creation by defaultAccount
        await this.contract.createStar('Star power 103!', 'dec_121.874', 'mag_245.978', 'ra_032.155', 'I love my wonderful star', { from:defaultAccount });
        // M19/M22 approved for user1
        await this.contract.setApprovalForAll(user1, 1);
        // M19/M22 approval validation for user1
        assert.equal(await this.contract.isApprovedForAll(defaultAccount, user1, { from:defaultAccount }), true);
      });

    });


    // Safe-transfer M30 from defaultAccount to user1
    describe('Testing `safeTransferFrom` from defaultAccount to user1', async () => {

      it('defaultAccount: Safe transfer of M30 to user1; ownership verified', async () => {
        // M32 creation by defaultAccount
        await this.contract.createStar('M30', 'dec_47.5', 'mag_7.7', 'ra_22.12', 'NGC 7099', { from:defaultAccount });
        // M32 safe transfer from defaultAccount to user1
        await this.contract.safeTransferFrom(defaultAccount, user1, 1);
        // M32 ownership verification as user1
        assert.equal(await this.contract.ownerOf(1, { from:defaultAccount }), user1);
      });

    });

  });


  // Tests initiated with user1
  describe('User-to-User Tests', () => {

    // Put Star up for sale / List stars for sale
    describe('Sell and List Stars for Sale', () => {

      it('user1 can create M2 and put it for sale', async () => {
        await this.contract.createStar('M2', 'dec_23.7', 'mag_6.3', 'ra_27.02', 'NGC 7089', { from:user1 });
        assert.equal(await this.contract.ownerOf(1), user1);
        await this.contract.putStarUpForSale(1, starPrice, { from:user1 });
        assert.equal(await this.contract.starsForSale(1), starPrice);
      });

      it('user1 can create M3/M4/M5/M9/M10, put M4/M5/M9 up for sale & validate these three listed for sale', async () => {
        // M3 creation: not for sale
        await this.contract.createStar('M3', 'dec_38.2', 'mag_6.2', 'ra_11.62', 'NGC 5272', { from:user1 });
        // M4 creation: for sale
        await this.contract.createStar('M4', 'dec_32.7', 'mag_5.9', 'ra_35.22', 'NGC 6121', { from:user1 });  // To be put on sale
        await this.contract.putStarUpForSale(2, starPrice, { from:user1 });
        // M5 creation: for sale
        await this.contract.createStar('M5', 'dec_51.7', 'mag_6.7', 'ra_33.22', 'NGC 5904', { from:user1 });  // To be put on sale
        await this.contract.putStarUpForSale(3, starPrice, { from:user1 });
        // M9 creation: for sale
        await this.contract.createStar('M9', 'dec_58.5', 'mag_8.4', 'ra_11.78', 'NGC 6333', { from:user1 });  // To be put on sale
        await this.contract.putStarUpForSale(4, starPrice, { from:user1 });
        // M10 creation: not for sale
        await this.contract.createStar('M10', 'dec_58.07', 'mag_6.4', 'ra_8.92', 'NGC 6254', { from:user1 });

        // Stars for sale - ensure this is accurate
        const starsForSale = await this.contract.allStarsForSale();
        assert.equal(starsForSale.length, 3);

        let starList = [];  // For sale-list validation
        for (let i = 0, star; i < starsForSale.length; i++) {
          star = starsForSale[i];
          starList.push(star.c[0]);
        }
        assert.notInclude(starList, 1);
        assert.include(starList, 2);
        assert.include(starList, 3);
        assert.include(starList, 4);
        assert.notInclude(starList, 5);
        assert.deepEqual(starList, [ 2, 3, 4 ]);
      });

    });


    // Star sale between users
    describe('user1 can put star up for sale & user2 can buy star; balances checked', () => {

      it('user2 is the owner of M13 after it is bought from user1', async () => {
        // M13 creation by user1
        await this.contract.createStar('M13', 'dec_35.5', 'mag_5.8', 'ra_41.24', 'NGC 6205: Great Globular Cluster in Hercules', { from:user1 });
        assert.equal(await this.contract.ownerOf(1), user1);

        // M13 (created above) put up for sale
        await this.contract.putStarUpForSale(1, starPrice, { from:user1 });

        // M13 sold from user1 to user2
        await this.contract.buyStar(1, { from:user2, gasPrice:0, value:starPrice });
        assert.equal(await this.contract.ownerOf(1), user2);
      });

      it('user2 balance is correct after M14 sale from user1', async () => {
        // M14 creation by user1
        await this.contract.createStar('M14', 'dec_45.3', 'mag_8.3', 'ra_36.15', 'some story', { from:user1 });
        assert.equal(await this.contract.ownerOf(1), user1);

        // M14 (created above) put up for sale
        await this.contract.putStarUpForSale(1, starPrice, { from:user1 });

        // M14 bought; balances before/after computed & verified
        const overpaidAmount = web3.toWei(0.05, 'ether');
        const balanceBeforeTransaction = web3.eth.getBalance(user2);
        await this.contract.buyStar(1, { from:user2, gasPrice:0, value:overpaidAmount});
        const balanceAfterTransaction = web3.eth.getBalance(user2);
        assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice);
      });

    });

  });

});
