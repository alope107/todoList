const { DataTypes } = require('sequelize');
const { db } = require('./conf');
const { List } = require('./list');

// A User of our application. Corresponds to an existing Github account.
const User = db.define('User', {
    // The user's username on Github
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // The unique id Github uses to identify the user.
    githubId: {
        type: DataTypes.INTEGER,
        unique: true,
    }
});

User.hasMany(List);
List.belongsTo(User);

// Returns a User object by its id with the relevant fields eagerly populated.
// Includes the user's lists.
async function getUser(id) {
    return User.findByPk(id, {    
        attributes: ['username', 'id'],
        include: {
            model: List,
        },
        order: [
            [List, 'id', 'ASC']
        ],
    });
};

// Returns the user in the DB that has the given githubId or
// creates a new one if none exists.
async function getOrCreateUser(githubId, username) {
    // Attempts to find user via github id
    let user = await User.findOne({where: { githubId: githubId }});
    // Creates a new user if one doesn't already exist
    if (!user) {
        user = await User.create({
            githubId: githubId,
            username: username,
        });
    }
    return user;
}

exports.User = User;
exports.getUser = getUser;
exports.getOrCreateUser = getOrCreateUser;