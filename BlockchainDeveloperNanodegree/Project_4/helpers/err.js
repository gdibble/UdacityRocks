'use strict';

/**
 * Log and throw error (and even exit node process)
 * @module
 *
 * @param {string} message
 * @param {Object} error
 * @param {boolean=false} noThrow - defaults to `false` (thus this will throw an error unless `true` is passed)
 * @param {boolean=false} exitProcess - defaults to `false` (thus this will not exit node unless `true` is passed)
 */
const err = (message, error, noThrow = false, exitProcess = false) => {
  const text = message + (error ? (' - ' + error) : '');
  console.log('\n\n ' + text);
  if (!noThrow)
    throw new Error(text);
  if (exitProcess && process)
    process.exit(1);
};

module.exports = err;
