const { Sequelize } = require('sequelize');

// Use an on-disk SQLite database stored in the file 'db.sqlite'
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
});

// Used to create the schemata in the database the first time the
// application is run
async function syncDB() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  try {
    await sequelize.sync();
    console.log('DB Synced')
  } catch(error) {
    console.error('Unable to sync database:', error);
  }
}

exports.db = sequelize;
exports.syncDB = syncDB;