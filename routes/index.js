var express = require('express');
var router = express.Router();

// Landing page that allows users to login via Github
router.get('/', function(req, res, next) {
  try {
    res.render('index', { 
      githubURL: makeGithubUrl(req.app.locals.clientId),
    });
  } catch (error) {
    return next(error);
  }
});

// Returns a Github URL that begins the authentication process with Github
function makeGithubUrl(clientId) {
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=http://localhost:3000/auth/redirect`;
}


module.exports = router;
