

const express = require('express');
const router = express.Router();
const { getList } = require('../models/list');
const { Task } = require('../models/task');
const { getUser } = require('../models/user');
const session = require('express-session');
var createError = require('http-errors');

router.get('/:id', async function(req, res, next) {
    try {
        // Send user to login page if they're not logged in
        if (!req.session.userId) {
            return res.redirect('/');
        }

        const list = await getList(req.params.id);
        // 404 if list not found
        if (!list) {
            return next();
        }

        // Error if a user tries to access a list they don't own
        if (list.UserId != req.session.userId) {
            return next(createError(403));
        }

        return res.render('list', { list: list });
    }
    catch(error) {
        return next(error);
    }
});

router.post("/new", async function(req, res, next) {
    try {
        // Send user to login page if they're not logged in
        if (!req.session.userId) {
            return res.redirect('/');
        }

        const user = await getUser(req.session.userId);

        const listTitle = req.body.title;
        const newList = await user.createList({
            title: listTitle,
        });

        // Redirect user to the newly created list
        return res.redirect(`/list/${newList.id}`)
    }
    catch (error) {
        return next(error);
    }
});

router.post("/:id/newTask", async function(req, res, next) {
    try {
        // Send user to login page if they're not logged in
        if (!req.session.userId) {
            return res.redirect('/');
        }
        
        const taskTitle = req.body.title;
        const list = await getList(req.params.id);
        // 404 if list not found
        if (!list) {
            return next();
        }

        // Error if a user tries to access a list they don't own
        if (list.UserId != req.session.userId) {
            return next(createError(403));
        }

        // Find the highest step in the list so far
        let maxStep = await Task.max('step', {where: {listId: list.id}});
        if (!maxStep) {
            maxStep = 0;
        }

        await list.createTask({
            title: taskTitle,
            // Make the new task have the new highest step
            step: maxStep + 1,
        });
        // Redirect the user to the modified list
        return res.redirect(`/list/${req.params.id}`);
    }
    catch (error) {
        return next(error);
    }
});

router.post("/:id/update", async function(req, res, next) {
    try {
        // Send user to login page if they're not logged in
        if (!req.session.userId) {
            return res.redirect('/');
        }

        const list = await getList(req.params.id);
        // 404 if list not found
        if (!list) {
            return next();
        }

        // Error if a user tries to access a list they don't own
        if (list.UserId != req.session.userId) {
            return next(createError(403));
        }

        // The body will contain all the ids for the completed taks.
        // It will not contain any uncompleted tasks.
        // For example, if tasks 1 and 3 were completed, but task 2 was uncompleted,
        // the body would look like this:
        // { 1: "on", 3: "on" }
        const taskStatuses = req.body;

        // Update each task's completion based on whether it's in the body.
        for (const task of list.Tasks) {
            const completed = task.id in taskStatuses;
            task.update({ completed: completed });
        }

        // Return user to viewing the list
        return res.redirect(`/list/${req.params.id}`);
    }
    catch (error) {
        return next(error);
    }
});

router.post("/delete/:id", async function(req, res, next) {
    try {
        // Send user to login page if they're not logged in
        if (!req.session.userId) {
            return res.redirect('/');
        }

        const list = await getList(req.params.id);
        // 404 if list not found
        if (!list) {
            return next();
        }

        // Error if a user tries to access a list they don't own
        if (list.UserId != req.session.userId) {
            return next(createError(403));
        }

        await list.destroy();
        return res.redirect('/user');
    }
    catch (error) {
        return next(error);
    }
});

module.exports = router;
