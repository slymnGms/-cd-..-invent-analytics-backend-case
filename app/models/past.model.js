module.exports = (sequelize, Sequelize) => {
    const Past = sequelize.define("past", {
        score: {
            type: Sequelize.FLOAT
        }
    });
    return Past;
};
