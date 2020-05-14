const express = require('express');
const userRoutes = require('./users/userRouter');

const server = express();

//server.use(logger);
server.use('/api/users', userRoutes);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log('Request info: ', req.method, req.url, new Date().toISOString());
  next();
}

module.exports = server;
