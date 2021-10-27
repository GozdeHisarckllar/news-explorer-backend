const { celebrate, Joi } = require('celebrate');
const articlesRouter = require('express').Router();
const { getSavedArticles, createSavedArticle, removeSavedArticle } = require('../controllers/articles');
const validateURL = require('../utils/validateUrl');

articlesRouter.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getSavedArticles);

articlesRouter.post('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateURL),
    image: Joi.string().required().custom(validateURL),
  }),
}), createSavedArticle);

articlesRouter.delete('/:articleId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
}), removeSavedArticle);

module.exports = articlesRouter;
