'use strict';
const err = require('./err');
const errMsg = 'toUTCTimestamp: Invalid timestamp';

/**
 * Convert milliseconds/seconds timestamp into UTC timestamp in seconds
 * @module
 *
 * @param {string|number} timestamp
 *
 * @returns {string} Example: "1538772547"
 *
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
const toUTCTimestamp = (timestamp) => {
  if (!timestamp)
    err(errMsg);
  timestamp = timestamp.toString();
  if ([ 10, 13 ].indexOf(timestamp.length) === -1)  // Validate as 10="seconds" or 13="milliseconds"
    err(errMsg);
  if (timestamp.length === 13)
    timestamp = Math.round(parseInt(timestamp)/1000).toString();  // Convert milliseconds to seconds
  return timestamp;
};

module.exports = toUTCTimestamp;
