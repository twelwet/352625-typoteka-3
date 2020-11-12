'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);

const {
  passNotNullData,
  passProperParam,
  tryToResponse,
  isAuth,
  validateArticle,
  validateComment,
} = require(`../middlewares`);


module.exports = (app, articleService, authService, commentService) => {
  const route = new Router();

  app.use(`/api/articles`, route);


  route.get(
      `/`,
      passNotNullData(articleService.findAll.bind(articleService), Empty.ARTICLES),
      tryToResponse(HttpCode.OK, Empty.ARTICLES)
  );


  route.get(
      `/mostDiscussed`,
      passNotNullData(articleService.findMostDiscussed.bind(articleService), Empty.ARTICLES),
      tryToResponse(HttpCode.OK, Empty.ARTICLES)
  );


  route.get(
      `/fresh`,
      (req, res) => res.redirect(`/api/articles/fresh/page=1`)
  );


  route.get(
      `/fresh/page=:pageNumber`,
      passProperParam(`pageNumber`, Empty.ARTICLES),
      passNotNullData(articleService.findFresh.bind(articleService), Empty.ARTICLES, `pageNumber`),
      tryToResponse(HttpCode.OK, Empty.ARTICLES)
  );


  route.get(
      `/byAuthor/:authorId`,
      passProperParam(`authorId`, Empty.ARTICLES),
      passNotNullData(articleService.findAllByAuthor.bind(articleService), Empty.ARTICLES, `authorId`),
      tryToResponse(HttpCode.OK, Empty.ARTICLES)
  );


  route.get(
      `/:articleId`,
      passProperParam(`articleId`, Empty.ARTICLE),
      passNotNullData(articleService.findOne.bind(articleService), Empty.ARTICLE, `articleId`),
      tryToResponse(HttpCode.OK, Empty.ARTICLE)
  );


  route.post(
      `/`,
      isAuth(authService.get.bind(authService)),
      validateArticle(),
      async (req, res, next) => {
        await articleService.add(req.body, res.auth.user.id);
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.put(
      `/:articleId`,
      isAuth(authService.get.bind(authService)),
      passProperParam(`articleId`, Empty.ARTICLE),
      validateArticle(),
      async (req, res, next) => {
        await articleService.update(req.body, req.params.articleId);
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.post(
      `/:articleId/comments`,
      isAuth(authService.get.bind(authService)),
      passProperParam(`articleId`, Empty.COMMENT),
      validateComment(),
      async (req, res, next) => {
        await commentService.add(req.body, req.params.articleId, res.auth.user.id);
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.delete(
      `/:articleId`,
      isAuth(authService.get.bind(authService)),
      passProperParam(`articleId`, Empty.ARTICLE),
      passNotNullData(articleService.findOne.bind(articleService), Empty.ARTICLE, `articleId`),
      async (req, res, next) => {
        await articleService.delete(req.params.articleId);
        next();
      },
      tryToResponse(HttpCode.OK)
  );
};
