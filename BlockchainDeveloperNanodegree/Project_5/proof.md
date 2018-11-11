# Proof of Completion
Author: Gabriel Dibble <gdibble@gmail.com>
For Udacity Blockchain Developer Nanodegree Term 1 Project 5

## Transaction:
0x8079f9a70cfae71b4c223da69f940b880df1e753147b8582656428dd19e01da3
https://rinkeby.etherscan.io/tx/0x8079f9a70cfae71b4c223da69f940b880df1e753147b8582656428dd19e01da3

## Contract:
0xf55923fca8ccf98218828aa173f3c4ad58e524c7
https://rinkeby.etherscan.io/address/0xf55923fca8ccf98218828aa173f3c4ad58e524c7

## CLI Output:

### Migration:
```
$ truffle migrate --network rinkeby
Using network 'rinkeby'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x91fb3fabf7b48356ae17acff8f00ee61f1e850e4ef57162fa67149dafb29c069
  Migrations: 0xfbed840924b44b7524bce9d07031e35ef55fb493
Saving successful migration to network...
  ... 0x4458c4cdf175eac24b3a563255b22b3460bd0e3d2afb7c5835b8c691bac305d9
Saving artifacts...
Running migration: 2_deploy_startnotary.js
  Deploying StarNotary...
  ... 0xf55f789b7323a17a3d8240a42b95d6fc4e4e92d0731b57e5799da9e545a6f239
  StarNotary: 0xf55923fca8ccf98218828aa173f3c4ad58e524c7
Saving artifacts...
```

### Unit Tests:
```
$ truffle test test/StarNotaryTest.js

  Contract: StarNotary - Tests with Globular Clusters
    defaultUser Tests
      Star creation and meta
        ✓ defaultAccount can create M1 and read its meta (353ms)
      defaultAccount can checkIfStarExist <-- `true`
        ✓ defaultAccount: star exists (165ms)
      Testing `approve` && `getApproved`
        ✓ defaultAccount: approve and getApproved (161ms)
      Testing `setApprovalForAll` && `isApprovedForAll`
        ✓ defaultAccount: setApprovalForAll and isApprovedForAll (156ms)
      Testing `safeTransferFrom` from defaultAccount to user1
        ✓ defaultAccount: Safe transfer of M30 to user1; ownership verified (176ms)
    User-to-User Tests
      Sell and List Stars for Sale
        ✓ user1 can create M2 and put it for sale (164ms)
        ✓ user1 can create M3/M4/M5/M9/M10, put M4/M5/M9 up for sale & validate these three listed for sale (725ms)
      user1 can put star up for sale & user2 can buy star; balances checked
        ✓ user2 is the owner of M13 after it is bought from user1 (233ms)
        ✓ user2 balance is correct after M14 sale from user1 (587ms)


  9 passing (4s)
```
