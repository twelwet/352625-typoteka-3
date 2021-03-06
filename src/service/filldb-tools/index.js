'use strict';

const getAvatars = require(`./avatars.js`);

const getAuthors = require(`./authors.js`);

const getArticles = require(`./articles.js`);

const getComments = require(`./comments.js`);

const getCategories = require(`./categories.js`);

const getArticlesCategories = require(`./articles-categories.js`);

const getContent = async (count, users, authUserId, sentences, titles, pictures, commentsSentences, categoriesSentences) => {
  const authors = await getAuthors(users);
  const avatars = getAvatars(users);
  const articles = getArticles(count, sentences, titles, pictures);
  const comments = getComments(articles, authors, commentsSentences);
  const categories = getCategories(categoriesSentences);
  const articlesCategories = getArticlesCategories(articles, categories);

  return {
    avatars,
    authors,
    articles,
    comments,
    categories,
    articlesCategories,
  };
};

module.exports = getContent;
