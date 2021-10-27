const { celebrate, Joi } = require('celebrate');
const usersRouter = require('express').Router();
const { getUserInfo } = require('../controllers/users');

usersRouter.get('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getUserInfo);

module.exports = usersRouter;
