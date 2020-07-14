const express = require('express');
const router = express.Router();
const { getOrCreateUser } = require('../models/user');

const axios = require('axios');

// This route is called via the redirect from the Github oauth flow.
// To learn more about how Github handles oauth, see here:
// https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
router.get("/redirect", async function(req, res, next) {
    try {
        // Use the data from Github's redirect to get an access token for querying
        // information about the user.
        const accessToken = await getAccessToken(req.query.code,
                                                 req.app.locals.clientId, 
                                                 req.app.locals.clientSecret);
        // Query Github's API for the user's username and Github ID.
        const githubUser = await getGithubUserData(accessToken);

        // Store user's username in the session so we can adress them by it later
        req.session.username = githubUser.username;

        // Fetches the existing user from the database or creates a new one if 
        // this is their first time logging into our application
        const user = await getOrCreateUser(githubUser.githubId, githubUser.username);

        // Store the user's ID in the session so we know who's logged in
        req.session.userId = user.id

        // Redirect to the user's main page
        return res.redirect('/user');
    }
    catch (error) {
        return next(error);
    }
});

// Gets an access token for a Github user.
async function getAccessToken(requestToken, clientId, clientSecret) {
    const response = await axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${requestToken}`,
        // Get the response in JSON
        headers: {
             accept: 'application/json'
        }
    });
    return response.data.access_token;
}

// Returns the username and githubId of the user whose access token is provided.
async function getGithubUserData(accessToken) {
    const userResponse = await axios({
        url:'https://api.github.com/user',
        headers: {
            authorization: `token ${accessToken}`,
        }, 
    });

    return { 
        username: userResponse.data.login, 
        githubId: userResponse.data.id
    };
}


module.exports = router;