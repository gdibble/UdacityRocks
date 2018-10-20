# Star Registry Blockchain with Notary Service API for Project 4
  * API server based on [HapiJS](http://hapijs.com), using [Level](https://github.com/Level/level) database in addtion to dependencies on [bitcoinjs-message](https://github.com/bitcoinjs/bitcoinjs-message), [boom](https://github.com/hapijs/boom), [crypto-js](https://github.com/brix/crypto-js) and [immutable](https://github.com/facebook/immutable-js), in addition to dev/test modules [chai](https://github.com/chaijs/chai), [mocha](https://github.com/mochajs/mocha) and [bitcore-message](https://github.com/bitpay/bitcore-message)
  * For audits, _all_ POSTs to API endpoint `/requestValidation` are saved with user request info
  * To avoid concurrency issues, the Blockchain is not cached and is refreshed in each operation
  * For scalability, the Blockchain is not loaded into memory to allow large chain operations
  * Blockchain creation allows for custom Genesis Block if passed
<br>

*Be sure to first install module dependencies with `npm i`*
<br>

## Run Unit Tests:
`npm run test`
<br>

## Start API server:
`npm start`
<br>

## Web Server API Endpoints and Usage:
*Routes mimic `privateBlockchain` Class API (except console-log output test methods)*<br><br>
* **GET `/`**<br>*API operability check*
  - **returns {string}**<br><br>
* **GET `/block/height`**<br>*Current height of the Blockchain*
  - **returns {number}**<br><br>
* **GET `/block/chain`**<br>*Return all blocks from the Blockchain*
  - query param {Boolean=} `?reverse=true` (optional)<br>*switch from ascending (Default/false) to descending order*
  - **returns {Array} Blockchain**<br><br>
* **GET `/block/{height}`**<br>*Get a block by passing the desired height*
  - param {number} block-height
  - **returns {Object} block**<br><br>
* **POST `/block`**<br>*Push a block onto the chain for a Bitcoin address, which as already passed both of the validation endpoint requests for `/requestValidation` and `/message-signature/validate`*
  - query param {Boolean=} `?overrideHeight=true` (optional)<br>*replaces block's `height` propery with current Blockchain height*
  - param {Object} block - (required) ex. `{ "address":"2MunkhBSNnzffDUMgMPNeqgWtsUAt9xdD1p","star":{ } }`
  - blockCfg `address` value is a required string and must be a valid Bitcoin address
  - blockCfg `star` value is a required Object
  - **returns {Object} new block**<br><br>
* **GET `/block/validate/{height}`**<br>*Validate a block*
  - param {number} block-height
  - **returns {Boolean} validity**<br><br>
* **GET `/block/validate/chain`**<br>*Validate full Blockchain*
  - **returns {Boolean} validity**<br><br>
* **POST `/requestValidation`**<br>*Request validation of a star with a Bitcoin address*
  - param {Object} request - (required) ex. `{ "address":"2MunkhBSNnzffDUMgMPNeqgWtsUAt9xdD1p" }`
  - request `address` value is a required string and must contain a valid Bitcoin address (Legacy, TestNet & Segwit addresses)
  - **returns {Object} response ammending properties `message` string, `requestTimestamp` of request and `validationWindow` in seconds**<br><br>
* **POST `/message-signature/validate`**<br>*Validate a star request with a Bitcoin address and signature*
  - param {Object} request - (required) ex. `{ "address":"2MunkhBSNnzffDUMgMPNeqgWtsUAt9xdD1p", "signature":"foo=" }`
  - request `address` value is a required string and must contain a valid Bitcoin address
  - request `signature` value is a required string and must contain the `/requestValidation` response `message` signed via private key
  - **returns {Object} response with properties `registerStar` as a Boolean and `status` Object including the payload and `messageSignature` prop as "valid" or "invalid"**<br><br>
* **GET `/stars/{byKeyValue}`**<br>*Search for one or many Blocks by passing a `key:value` pair*
  - param {string} byKeyValue - such as `/stars/address:2MunkhBSNnzffDUMgMPNeqgWtsUAt9xdD1p`
  - **returns {Array|Object} When searching for a `hash`, a Block-singleton is returned; otherwise an Array of Blocks will be returned**<br><br>
<br>

## Class API Methods and Usage:
* `const Blockchain = require('./privateBlockchain');`
  - *Load library*<br><br>
* `const bc = new Blockchain(genesisBlock);`
  - `genesisBlock` argument optional
  - *Instantiate new Blockchain*<br><br>
* `const b = new Blockchain.Block(blockCfg);`
  - blockCfg argument optional and its props [below] are also optional<br>`{ "hash":"", "height":0, "body":"", "time":0, "previousBlockHash":"" }`
  - *Instantiate new Block*<br><br>
* **`bc.getBlockHeight();`**
  - Returns the current height of the Blockchain<br><br>
* **`bc.listBlocks();`**
  - Lists an array of the entire Blockchain<br><br>
* **`bc.getBlocks();`**
  - `reverse` Boolean argument optional; switch from ascending (Default/false) to descending order
  - Returns and array with the entire Blockchain<br><br>
* **`bc.getBlock(blockHeight);`**
  - `blockHieght` Numeric argument optional - falls back to topmost block in the chain
  - Returns block at requested height<br><br>
* **`bc.getTest(blockHeight);`**
  - `blockHieght` Numeric argument optional - falls back to topmost block in the chain
  - Logs block at requested height [in console] to verify GET response<br><br>
* **`bc.addBlock(newBlock);`**
  - `blockCfg` argument is required and must conform to specifications of
  - blockCfg `body` value is a required string and must contain a value
  - blockCfg `height` value must equal Blockchain height, except in the following case
  - `overrideHeight` Boolean argument optional - replaces block's `height` propery with current Blockchain height<br><br>
* **`bc.validateBlock(blockHeight);`**
  - `blockHieght` Numeric argument optional - falls back to topmost block in the chain
  - Regenerates hash for block at requested height and checks against itself<br><br>
* **`bc.validateChain();`**
  - Validates each block in the chain in relation to the block before it
<br>

## Block I/O Examples:
* **Validate User Request<br>REST `POST` to `/requestValidation`**
  * **payload:** `{ "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ" }`
  * **response:** `{ "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "requestTimeStamp": "1532296090", "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry", "validationWindow": 300 }`<br><br>
* **Allow User Message Signature<br>REST `POST` to `/message-signature/validate`**
  * **payload:** `{ "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "signature": "H6ZrGrF0Y4rMGBMRT2+hHWGbThTIyhBS0dNKQRov9Yg6GgXcHxtO9GJN4nwD2yNXpnXHTWU9i+qdw5vpsooryLU=" }`
  * **response:** `{ "registerStar": true, "status": { "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "requestTimeStamp": "1532296090", "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry", "validationWindow": 193, "messageSignature": "valid" } }`<br><br>
* **Search by Blockchain Wallet Address<br>REST `GET` from `/stars/address:ADDRESS`, or Class method `bc.getStars('address', ADDRESS)`**
  * **request:** `/stars/address:142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ`
  * **response:** `[ { "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f", "height": 1, "body": { "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "star": { "ra": "16h 29m 1.0s", "dec": "-26° 29' 24.9", "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f", "storyDecoded": "Found star using https://www.google.com/sky/" } }, "time": "1532296234", "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3" }, { "hash": "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0", "height": 2, "body": { "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "star": { "ra": "17h 22m 13.1s", "dec": "-27° 14' 8.2", "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f", "storyDecoded": "Found star using https://www.google.com/sky/" } }, "time": "1532330848", "previousBlockHash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f" } ]`<br><br>
* **Search by Star Block Hash<br>REST `GET` from `/stars/address:HASH`, or Class method `bc.getStars('hash', HASH)`**
  * **request:** `/stars/hash:a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f`
  * **response:** `{ "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f", "height": 1, "body": { "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "star": { "ra": "16h 29m 1.0s", "dec": "-26° 29' 24.9", "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f", "storyDecoded": "Found star using https://www.google.com/sky/" } }, "time": "1532296234", "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3" }
`<br><br>
* **Search by Star Block Height<br>REST `GET` from `/block/HEIGHT`, or Class method `bc.getBlock(HEIGHT)`**
  * **request:** `/block/1`
  * **response:** `{ "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f", "height": 1, "body": { "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "star": { "ra": "16h 29m 1.0s", "dec": "-26° 29' 24.9", "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f", "storyDecoded": "Found star using https://www.google.com/sky/" } }, "time": "1532296234", "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3" }`<br><br>
* **Create a Block<br>REST `POST` to `/block`, or Class method `bc.addBlock(payload)`**
  * **payload:** `{ "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "star": { "dec": "-26° 29'\'' 24.9", "ra": "16h 29m 1.0s", "story": "Found star using https://www.google.com/sky/" } }`
  * **response:** `{ "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f", "height": 1, "body": { "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "star": { "ra": "16h 29m 1.0s", "dec": "-26° 29' 24.9", "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f" } }, "time": "1532296234", "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3" }`


---

Author: Gabriel Dibble <gdibble@gmail.com> &copy; 2018
