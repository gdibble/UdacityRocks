# Private Blockchain with API for Project 3
  * API server based on [HapiJS](http://hapijs.com), using [Level](https://github.com/Level/level) database in addtion to dependencies on [boom](https://github.com/hapijs/boom) and [crypto-js](https://github.com/brix/crypto-js)
  * To avoid concurrency issues, the Blockchain is not cached and is refreshed in each operation, as is standard practice in Enterprise code
  * For scalability, the Blockchain is not loaded into memory to allow large chain operations
  * Blockchain creation allows for custom Genesis Block if passed

## Run API server:
`npm start`

*Be sure to install module first: `npm i`*

## Server API Endpoints and Usage:
*Routes mimic `privateBlockchain` Class API (except console-log output test methods)*<br><br>
* **GET `/block/height`**<br>*Current height of the Blockchain*
  - **returns {number}**<br><br>
* **GET `/block/chain`**<br>*Return all blocks from the Blockchain*
  - query param {Boolean=} `?reverse=true` (optional)<br>*switch from ascending (Default/false) to descending order*
  - **returns {Array} Blockchain**<br><br>
* **GET `/block/{height}`**<br>*Get a block by passing the desired height*
  - param {number} block-height
  - **returns {Object} block**<br><br>
* **POST `/block`**<br>*Push a block onto the chain*
  - query param {Boolean=} `?overrideHeight=true` (optional)<br>*replaces block's `height` propery with current Blockchain height*
  - param {Object} block - (required) ex. `{ body:"Required" }`
  - blockCfg `body` value is a required string and must contain a value
  - blockCfg `height` value must equal Blockchain height
  - **returns {object} new block**<br><br>
* **GET `/block/validate/{height}`**<br>*Validate a block*
  - param {number} block-height
  - **returns {Boolean} validity**<br><br>
* **GET `/block/validate/chain`**<br>*Validate full Blockchain*
  - **returns {Boolean} validity**

## Class API Methods and Usage:
* `const Blockchain = require('./privateBlockchain');`
  - *Load library*
* `const bc = new Blockchain(genesisBlock);`
  - `genesisBlock` argument optional
  - *Instantiate new Blockchain*
* `const b = new Blockchain.Block(blockCfg);`
  - blockCfg argument optional and its props [below] are also optional<br>`{ "hash":"", "height":0, "body":"", "time":0, "previousBlockHash":"" }`
  - *Instantiate new Block*
* **`bc.getBlockHeight();`**
  - Returns the current height of the Blockchain
* **`bc.listBlocks();`**
  - Lists an array of the entire Blockchain
* **`bc.getBlocks();`**
  - `reverse` Boolean argument optional; switch from ascending (Default/false) to descending order
  - Returns and array with the entire Blockchain
* **`bc.getBlock(blockHeight);`**
  - `blockHieght` Numeric argument optional - falls back to topmost block in the chain
  - Returns block at requested height
* **`bc.getTest(blockHeight);`**
  - `blockHieght` Numeric argument optional - falls back to topmost block in the chain
  - Logs block at requested height [in console] to verify GET response
* **`bc.addBlock(newBlock);`**
  - `blockCfg` argument is required and must conform to specifications of
  - blockCfg `body` value is a required string and must contain a value
  - blockCfg `height` value must equal Blockchain height, except in the following case
  - `overrideHeight` Boolean argument optional - replaces block's `height` propery with current Blockchain height
* **`bc.validateBlock(blockHeight);`**
  - `blockHieght` Numeric argument optional - falls back to topmost block in the chain
  - Regenerates hash for block at requested height and checks against itself
* **`bc.validateChain();`**
  - Validates each block in the chain in relation to the block before it

---

Author: Gabriel Dibble <gdibble@gmail.com> &copy; 2018
