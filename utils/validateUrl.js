const isURL = require('validator/lib/isURL');

const validateURL = (string) => {
  if (!isURL(string)) {
    throw new Error('The URL is invalid');
  }
  return string;
};

module.exports = validateURL;
