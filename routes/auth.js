const express = require('express');
// const { message } = require('statuses');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');

const User = mongoose.model('User');

const requireLogin = require('../middlewares/requireLogin.js');

router.get('/', (req, res) => {
  res.send('Welcome');
});

router.get('/protected', requireLogin, (req, res) => {
  res.status(200).send('Protected Page hit');
});

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: 'Please fill all the fields' });
  }
  User.findOne({ email: email }, async (err, savedUser) => {
    if (savedUser) {
      return res.status(422).json({ message: 'User already exist' });
    } else if (err) {
      return res.status(422).json({ message: 'Something went wrong' });
    } else {
      try {
        hashedpassword = await bcrypt.hash(password, 12);
        const user = new User({
          email,
          password: hashedpassword,
          name,
        });
        const item = await user.save();
        console.log(item);
        res.json({ message: 'successfully saved user' });
      } catch (e) {
        console.log(e);
      }
      
    }
  });
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: 'Please fill in all the fields' });
  }
  User.findOne({ email: email }, async (err, foundUser) => {
    if (!foundUser) {
      return res.status(422).json({ error: 'User not found, invalid email' });
    }
    try {
      const result = await bcrypt.compare(password, foundUser.password);
      if (!result) {
        console.log('Password did not match user!');
        return res.status(442).json({ error: 'Password did not match user!' });
      }
      const token = await jwt.sign({ _id: foundUser._id }, JWT_SECRET, {
        expiresIn: '1h',
      });
      console.log('successfully logged in');
      res.status(200).json({ token: token });
      // res.status(400).json({ message: 'successfully logged in' });
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
