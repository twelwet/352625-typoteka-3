'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();


module.exports = (app, commentService) => {
  const route = new Router();

  app.use(`/api/comments`, route);

  route.get(`/fresh`, async (req, res) => {
    try {
      const data = await commentService.findFresh();

      if (!data || data.length === 0) {
        res.status(HttpCode.BAD_REQUEST).json(Empty.COMMENTS);
      } else {
        res.status(HttpCode.OK).json(data);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.COMMENTS);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.get(`/byAuthor/:id`, async (req, res) => {
    try {
      let data = null;
      const authorId = parseInt(req.params.id, 10);

      if (authorId) {
        data = await commentService.findAllByAuthor(authorId);
      }

      if (data) {
        res.status(HttpCode.OK).json(data);
      } else {
        res.status(HttpCode.BAD_REQUEST).json(Empty.COMMENTS);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.COMMENTS);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.delete(`/:commentId`, async (req, res) => {
    try {
      let comment = null;
      const commentId = parseInt(req.params.commentId, 10);

      if (commentId) {
        comment = await commentService.findOne(commentId);
      }

      if (comment) {
        commentService.delete(commentId);
        res.status(HttpCode.OK).send(`Comment is deleted`);
      } else {
        res.status(HttpCode.BAD_REQUEST).send(`Comment doesn't exist`);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.COMMENTS);
      logger.error(`Error occurs: ${error}`);
    }
  });
};