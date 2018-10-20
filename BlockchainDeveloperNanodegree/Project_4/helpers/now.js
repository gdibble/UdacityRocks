'use strict';

/**
 * Return valid UTC timestamp in seconds
 * @module
 *
 * @returns {string} Example: "1535225472"
 *
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
const now = () => {
  return (Math.round(Date.now()/1000)).toString();
};

module.exports = now;
