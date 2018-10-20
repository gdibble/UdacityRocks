const sha256 = require('crypto-js/sha256')


// Timestamp helper
const now = () => {
  return new Date().getTime().toString().slice(0, -3);
};

// Block class
class Block {
  constructor(block) {
      block = block || {}
      this.previousblockhash = block.previousblockhash || null;
      this.time = block.time || now();
      this.body = block.body || [];
      this.height = block.height || 0;
      this.hash = block.hash || sha256(this).toString();
    }
}

// Blockchain init & utils
class Blockchain {
  constructor(chain, genesisBlock) {
      genesisBlock = genesisBlock instanceof Object && genesisBlock || new Block({ body:[ 'Udacity', 'rocks!' ] });
      this.chain = chain instanceof Array && chain || [];
      this.addBlock(genesisBlock);
    }

    // Push a block onto the chain
    addBlock(newBlock) {
      let height = this.chain.length
        let prevHeight = height - 1;
      // Set new block data
      newBlock.hash = sha256(JSON.stringify(newBlock)).toString();
      newBlock.height = height;
      newBlock.time = now();
        if (height > 0) {
          newBlock.previousblockhash = this.chain[prevHeight].hash;
        }
      // Add new block to the chain
      this.chain.push(newBlock);
    }

  // List all blocks on the chain
  listBlocks() {
      console.log(this.chain);
    }
}
