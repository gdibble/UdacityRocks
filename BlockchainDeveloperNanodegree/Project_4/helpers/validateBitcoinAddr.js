'use strict';

/**
 * Validate Bitcoin address
 * @typedef {RegExp}
 * @author http://mokagio.github.io/tech-journal/2014/11/21/regex-bitcoin.html
 * @author https://stackoverflow.com/questions/21683680/regex-to-match-bitcoin-addresses
 */
const isLegacydAddress = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
const isTestnetAddress = /^[2][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
const isSegwitAddress = /^(bc1|tb1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;  // Bech32 validity (mainnet/testnet)

/**
 * Validate a Bitcoin address
 * @module
 *
 * @param {string} address
 *
 * @returns {boolean}
 *
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
const validateBitcoinAddress = (address) => {
  return isLegacydAddress.test(address) || isTestnetAddress.test(address) || isSegwitAddress.test(address);
};

module.exports = validateBitcoinAddress;
