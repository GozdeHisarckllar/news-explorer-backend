const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const config = require('../config');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : config.jwt.devKey,
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      ...req.body,
      password: hash,
    }))
    .then((createdUser) => {
      User.findById(createdUser._id)
        .then((user) => res.status(201).send({ data: user }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError('User with this email address already exists.'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('User ID not found');
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};
