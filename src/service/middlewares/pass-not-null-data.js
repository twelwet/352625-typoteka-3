'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

module.exports = (service, mock, param = null) => (
  async (req, res, next) => {
    try {
      const data = await service(req.params[`${param}`]);

      if (!data || data.length === 0) {
        res.status(HttpCode.BAD_REQUEST).json(mock);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
        return;
      }

      res.body = data;

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(mock);
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      return;
    }

    next();
  }
);
