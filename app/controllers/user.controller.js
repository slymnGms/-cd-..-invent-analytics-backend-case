const db = require("../models");
const User = db.users;
const Book = db.books;
const Past = db.past;
const Present = db.present;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const user = {
        name: req.body.name
    };
    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
};
exports.findAll = (req, res) => {
    User.findAll({ attributes: ['id', 'name'] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });

};
exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findByPk(id, { attributes: ['id', 'name'] })
        .then(data => {
            if (data) {
                data.dataValues.books = { past: [], present: [] };
                Past.findAll({
                    where: { user_id: id },
                    include: {
                        model: Book,
                        as: "bookPast"
                    },
                    attributes: ["bookPast.name", "score"]
                })
                    .then(dataPast => {
                        dataPast.forEach(obj => {
                            data.dataValues.books.past.push({
                                name: obj.dataValues.bookPast.dataValues.name,
                                score: obj.score
                            })
                        })
                        Present.findAll({
                            where: { user_id: id },
                            include: {
                                model: Book,
                                as: "bookPresent"
                            },
                            attributes: ["bookPresent.name"]
                        })
                            .then(dataPresent => {
                                dataPresent.forEach(obj => {
                                    data.dataValues.books.present.push({
                                        name: obj.dataValues.bookPresent.dataValues.name
                                    })
                                });
                                res.send(data);
                            })
                    })
            } else {
                res.status(404).send({
                    message: `Cannot find User with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with id=" + id
            });
        });

};

exports.borrowBook = (req, res) => {
    const user_id = req.params.user_id;
    const book_id = req.params.book_id;

    var userExists, bookExists, isAvailable = false;
    //check user exists
    User.findAndCountAll({ where: { 'id': user_id } })
        .then(data => {
            if (data.count > 0) {
                userExists = true;
                //check book exists
                Book.findAndCountAll({ where: { 'id': book_id } })
                    .then(data => {
                        if (data.count > 0) {
                            bookExists = true;
                            if (bookExists & userExists) {
                                //check for the book if its borrowed
                                Present.findAndCountAll({ where: { 'book_id': book_id } })
                                    .then(data => {
                                        if (data.count > 0) {
                                            res.status(500).send({
                                                message:
                                                    "Sorry, the book already borrowed"
                                            });
                                        }
                                        else {
                                            isAvailable = true;
                                            if (isAvailable) {
                                                const borrow = {
                                                    user_id: user_id,
                                                    book_id: book_id
                                                }
                                                Present.create(borrow)
                                                    .then(data => {
                                                        res.send([{ message: "Congrats." }, data]);
                                                    })
                                                    .catch(err => {
                                                        res.status(500).send({
                                                            message:
                                                                err.message || "Some error occurred while searching borrow operation"
                                                        });
                                                    })
                                            }
                                        }

                                    })
                                    .catch(err => {
                                        res.status(500).send({
                                            message:
                                                err.message || "Some error occurred while searching borrow operation."
                                        });
                                    });
                            }
                        } else {
                            res.status(500).send({
                                message:
                                    "Some error occurred while searching borrow operation."
                            });
                        }
                    })
            } else {
                res.status(500).send({
                    message:
                        "Some error occurred while searching borrow operation."
                });
            }
        })
}

exports.returnBook = (req, res) => {
    const user_id = req.params.user_id;
    const book_id = req.params.book_id;
    const score = req.body.score;

    if (!req.body.score) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    var userExists, bookExists, isAvailable = false;
    //check user exists
    User.findAndCountAll({ where: { 'id': user_id } })
        .then(data => {
            if (data.count > 0) {
                userExists = true;
                //check book exists
                Book.findAndCountAll({ where: { 'id': book_id } })
                    .then(data => {
                        if (data.count > 0) {
                            bookExists = true;
                            if (bookExists & userExists) {
                                //check for the book if its borrowed
                                Present.findAndCountAll({ where: { 'book_id': book_id } })
                                    .then(data => {
                                        if (data.count < 1) {
                                            res.status(500).send({
                                                message:
                                                    "Sorry, the book not borrowed by you"
                                            });
                                        }
                                        else {
                                            isAvailable = true;
                                            if (isAvailable) {

                                                //removing from present
                                                Present.destroy({ where: { 'book_id': book_id, 'user_id': user_id } })
                                                    .then(num => {
                                                        if (num == 1) {
                                                            //creating past
                                                            const past = {
                                                                user_id: user_id,
                                                                book_id: book_id,
                                                                score: score
                                                            }
                                                            Past.create(past)
                                                                .then(data => {
                                                                    res.send([{ message: "Congrats." }, data]);
                                                                })
                                                                .catch(err => {
                                                                    res.status(500).send({
                                                                        message:
                                                                            err.message || "Some error occurred while searching borrow operation"
                                                                    });
                                                                })
                                                        }
                                                    })
                                                    .catch(err => {
                                                        res.status(500).send({
                                                            message:
                                                                err.message || "Some error occurred while searching borrow operation"
                                                        });
                                                    })

                                            }
                                        }

                                    })
                                    .catch(err => {
                                        res.status(500).send({
                                            message:
                                                err.message || "Some error occurred while searching borrow operation."
                                        });
                                    });
                            }
                        } else {
                            res.status(500).send({
                                message:
                                    "Some error occurred while searching borrow operation."
                            });
                        }
                    })
            } else {
                res.status(500).send({
                    message:
                        "Some error occurred while searching borrow operation."
                });
            }
        })
}