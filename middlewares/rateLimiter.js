const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 90,
});

module.exports = rateLimiter;
