const Article = require('../models/article');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getSavedArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .orFail(() => {
      throw new NotFoundError('No articles found');
    })
    .then((articles) => {
      res.status(200).send({ data: articles });
    })
    .catch(next);
};

module.exports.createSavedArticle = (req, res, next) => {
  Article.create({ owner: req.user._id, ...req.body })
    .then((createdArticle) => {
      Article.findById(createdArticle._id)
        .then((article) => res.status(201).send({ data: article }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
        return;
      }
      next(err);
    });
};

module.exports.removeSavedArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findById(articleId)
    .orFail(() => {
      throw new NotFoundError('Article ID not found');
    })
    .select('+owner')
    .then((article) => {
      if (article.owner.equals(req.user._id)) {
        Article.deleteOne(article)
          .then(() => {
            res.status(200).send({ message: 'The saved article has been successfully removed' });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Forbidden to remove an article saved by another user');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Incorrect ID'));
        return;
      }
      next(err);
    });
};
