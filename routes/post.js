const express = require('express');
// const { message } = require('statuses');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const requireLogin = require('../middlewares/requireLogin.js');

router.get('/allpost', (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      return console.log(err);
    }
    res.status(201).json({ posts });
  }).populate('postedBy', '_id name');
});

router.post('/createpost', requireLogin, async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(422).json({ err: 'Please fill all fields' });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    postedBy: req.user,
  });
  try {
    const postedItem = await post.save();
    res.json({ post: postedItem });
  } catch (err) {
    console.log(err);
  }
});

router.get('/mypost',requireLogin, async (req, res) => {
  Post.find({ postedBy: req.user._id }, async (err, posts) => {
    res.json({ post: posts });
  }).populate('postedBy', '_id name');
});

module.exports = router;
