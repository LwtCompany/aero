const TokenBuilder = require('../service/myToken');

const verifyToken = () => {
     return (req, res, next) => {
          TokenBuilder.verifyToken(req, res, next);
     }
}

module.exports = verifyToken;

