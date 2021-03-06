'use strict';

const {Op} = require(`sequelize`);
const {db} = require(`./../../data/db/db.js`);
const {SEARCH_LIMIT} = require(`../api/constants.js`);

class SearchService {
  constructor(database = db) {
    this._database = database;
  }

  async findSome(typingData, count = SEARCH_LIMIT) {
    return await this._database.Article.findAll({
      limit: count,
      where: {
        title: {
          [Op.iLike]: `%${typingData}%`,
        }
      },
    });
  }
}

module.exports = SearchService;
