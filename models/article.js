const { Schema, model } = require('mongoose');
const isUrl = require('validator/lib/isURL');

const articleSchema = new Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isUrl(v),
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isUrl(v),
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

module.exports = model('article', articleSchema);
