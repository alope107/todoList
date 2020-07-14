const { DataTypes } = require('sequelize');
const { db } = require('./conf');

// A Task is a single item on a Todo list.
const Task = db.define('Task', {
    // Name of the task
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Whether the task has been finished
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    // Used for ordering tasks within a list
    step: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// Returns a task object given its id.
// Eagerly fills relevant attributes.
async function getTask(id) {
    return Task.findByPk(id, {    
        attributes: ['title', 'completed', 'step', 'id'],
    });
};

exports.Task = Task;
exports.getTask = getTask;