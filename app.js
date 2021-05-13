const express = require('express');
const app = express();
const PORT = 5002;

const { MONGO_URL } = require('./keys');
const mongoose = require('mongoose');

// Connecting to MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected!');
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB failed to connect!', err);
});

//Models
require('./models/user');
require('./models/post');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

// Listening to Server
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});

// const customMiddleware = (req, res, next) => {
//   console.log("middleware excuted");
//   next();
// }

// app.use(customMiddleware);

// app.get('/', (req, res) => {
//   console.log('home');
//   res.send("Home Page...");
// })
// app.get('/about', customMiddleware, (req, res) => {
//   console.log('About');
//   res.send("About Page...")
// })
