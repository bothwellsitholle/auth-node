const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  body: {
    type: String,
    require: true,
  },
  picture: {
    type: String,
    default: 'no photo',
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

mongoose.model('Post', postSchema);
