module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define("book", {
        name: {
            type: Sequelize.STRING
        }
    });
    return Book;
};
