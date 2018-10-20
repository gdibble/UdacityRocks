/**
 * Return valid UTC timestamp
 * @module
 *
 * @returns {string} Example: "1535225472"
 *
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
const now = () => {
  return new Date().getTime().toString().slice(0, -3);
};


module.exports = now;
