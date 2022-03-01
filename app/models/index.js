const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./user.model.js")(sequelize, Sequelize);
db.books = require("./book.model.js")(sequelize, Sequelize);
db.past = require("./past.model.js")(sequelize, Sequelize);
db.present = require("./present.model.js")(sequelize, Sequelize);

// relations
db.users.hasMany(db.present, { as: "present", })
db.books.hasMany(db.present, { as: "present", })
db.users.hasMany(db.past, { as: "past", })
db.books.hasMany(db.past, { as: "past", })
db.past.belongsTo(db.users, { foreignKey: "user_id", as:"userPast" });
db.present.belongsTo(db.users, { foreignKey: "user_id", as:"userPresent" });
db.past.belongsTo(db.books, { foreignKey: "book_id", as:"bookPast" });
db.present.belongsTo(db.books, { foreignKey: "book_id", as:"bookPresent" });
module.exports = db;
