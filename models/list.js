const { DataTypes } = require('sequelize');
const { db } = require('./conf');
const { Task } = require('./task');

// A List is owned by a single User and can contain multiple tasks.
const List = db.define('List', {
    // The name of the list
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

List.hasMany(Task);
Task.belongsTo(List);

// Returns a List object by its id with the relevant fields eagerly populated.
// Includes the list's tasks.
async function getList(id) {
    return List.findByPk(id, {    
        attributes: ['title', 'id', 'UserId'],
        include: {
            model: Task,
        },
        order: [
            [Task, 'step', 'ASC']
        ],
    });
};

exports.List = List;
exports.getList = getList;