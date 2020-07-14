var express = require('express');
var router = express.Router();

var { getUser } = require('../models/user');

// The user page shows all lists a user has and allows them to delete or create more.
router.get('/', async function(req, res, next) {
  try {
    // Send user to login page if they're not logged in
    if (!req.session.userId) {
      return res.redirect('/');
    }

    const user = await getUser(req.session.userId);
    return res.render('user', { 
      username: req.session.username,
      lists: user.Lists,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
