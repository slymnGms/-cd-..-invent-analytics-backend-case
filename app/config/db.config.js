module.exports = {
    dialect: "sqlite",
    storage: "./db.sqlite",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  