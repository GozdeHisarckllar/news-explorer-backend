const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes');
const config = require('./config');
const handleError = require('./middlewares/handleError');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimiter');

const { PORT = 3000 } = process.env;

const app = express();

require('dotenv').config();

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.options('*', cors());

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.MONGODB_HOST : config.db.host);

app.use(requestLogger);

app.use(rateLimiter);

app.use('/', routes);

app.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
