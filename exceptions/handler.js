const logger = require('../logger.js');

// error handler
exports.handleError = function(err, res, status) {
    logger.error(err);
    res.status(status);
    res.send(err);
};
