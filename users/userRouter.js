const userDb = require('./userDb');
const postDb = require('../posts/postDb.js');
const express = require('express');

const router = express.Router();

router.use('/:id', validateUserId);
//router.post('/', validateUser);
router.post('/:id/posts', validatePost);

router.post('/', validateUser, (req, res) => {
  userDb.insert(req.body).then(user => {
    res.status(201).json(user);
  }).catch(e => {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database"
    });
  });
});

router.post('/:id/posts', (req, res) => {
  const newPost = req.body;
  newPost.user_id = req.user.id;
  postDb.insert(newPost).then(post => {
    res.status(201).json(post);
  }).catch(e => {
    res.status(500).json({
      errorMessage: "There was an error while saving the post to the database"
    });
  });
});

router.get('/', async (req, res) => {
  userDb.get().then(users => {
    res.status(200).json(users);
  }).catch(e => {
    res.status(500).json({
      errorMessage: "The users information could not be retrieved."
    });
  });
});

router.get('/:id', (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', (req, res) => {
  postDb.get().then(posts => {
    res.status(200).json(posts.filter(post => post.user_id === req.user.id));
  }).catch(e => {
    res.status(500).json({
      errorMessage: "The posts information could not be retrieved."
    });
  });
});

router.delete('/:id', (req, res) => {
  userDb.remove(req.user.id).then(numRecordsDeleted => {
    if (numRecordsDeleted) {
      res.status(200).json({recordsDeleted: numRecordsDeleted});
    } else {
      throw "User with specified ID does not exist";
    }
  }).catch(e => {
    res.status(500).json({error: "The post could not be removed" });
  });
});

router.put('/:id', validateUser, (req, res) => {
  userDb.update(req.user.id, req.body).then(numRecordsUpdated => {
    if (numRecordsUpdated) {
      // Not the best way to do this. What if body has extra info? That
      // shouldn't be returned...
      res.status(200).json({...req.body, id: req.user.id});
    } else {
      res.status(404).json({
        message: 'The user with the specified ID does not exist.'
      });
    }
  }).catch(e => {
    console.log('put error: ', e);
    res.status(500).json({error: "The user information could not be modified." });
  });
});

//custom middleware

function validateUserId(req, res, next) {
  userDb.getById(req.params.id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({
        message: 'invalid user id'
      });
    }
  });
}

function validateUser(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({
      message: "missing user data"
    });
  } else if (!req.body.name) {
    res.status(400).json({
      message: "missing required name field"
    });
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({
      message: "missing post data"
    });
  } else if (!req.body.text) {
    res.status(400).json({
      message: "missing required text field"
    });
  } else {
    next()
  }
}

module.exports = router;
