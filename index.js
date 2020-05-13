const express = require('express');
const userRoutes = require('./users/userRouter');
const server = express();

server.use('/api/users', userRoutes);

server.listen(5000, () => 
  console.log('Server running on http://localhost:5000')
);

