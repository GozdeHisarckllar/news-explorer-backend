const router = require('express').Router();
const usersRouter = require('./users');
const articlesRouter = require('./articles');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', createUser);

router.post('/signin', login);

router.use('/users', auth, usersRouter);

router.use('/articles', auth, articlesRouter);

module.exports = router;
