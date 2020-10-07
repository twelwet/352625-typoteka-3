'use strict';

const express = require(`express`);
const {Router} = require(`express`);

const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
const {getLogger} = require(`./../logger.js`);

const {getFreshComments, getCommentsByUserId} = require(`./utils/comments.js`);
const {getComment, deleteComment} = require(`./utils/comment.js`);

const logger = getLogger();

const commentsRouter = new Router();

commentsRouter.use(express.json());

commentsRouter.get(`/fresh`, async (req, res) => {
  try {
    const data = await getFreshComments();

    if (!data || data.length === 0) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.COMMENTS);
    } else {
      res.json(data);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.COMMENTS);
    logger.error(`Error occurs: ${error}`);
  }
});

commentsRouter.get(`/byUser/:id`, async (req, res) => {
  try {
    let data = null;
    const commentId = parseInt(req.params.id, 10);

    if (commentId) {
      data = await getCommentsByUserId(commentId);
    }

    if (data) {
      res.json(data);
    } else {
      res.status(HttpCode.BAD_REQUEST).json(Empty.COMMENTS);
    }

    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.COMMENTS);
    logger.error(`Error occurs: ${error}`);
  }
});

// TODO не получилось реализвать удаление коммента через метод DELETE
commentsRouter.post(`/:commentId`, async (req, res) => {
  try {
    let comment = null;
    const commentId = parseInt(req.params.commentId, 10);

    if (commentId) {
      comment = await getComment(commentId);
    }

    if (comment) {
      deleteComment(commentId);
      res.status(HttpCode.OK).send(`Comment is deleted`);
    } else {
      res.status(HttpCode.BAD_REQUEST).send(`Comment doesn't exist`);
    }

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.COMMENTS);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = commentsRouter;
