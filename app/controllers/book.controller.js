const db = require("../models");
const Book = db.books;
const Past = db.past;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const book = {
        name: req.body.name
    };
    Book.create(book)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Book."
            });
        });
};
exports.findAll = (req, res) => {
    Book.findAll({ attributes: ['id', 'name'] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving books."
            });
        });

};
exports.findOne = (req, res) => {
    const id = req.params.id;

    Book.findByPk(id, {
        attributes: ['id', 'name']
    })
        .then(data => {
            console.log(data);
            if (data) {
                data.dataValues['score'] = -1;
                var total, count = 0;
                Past.count({ where: { 'book_id': id } })
                    .then(c => {
                        count = c;
                        if (count > 0) {
                            Past.sum('score', { where: { 'book_id': id } }).then(s => {
                                total = s;
                                data.dataValues['score'] = total / count;
                                res.send(data);
                            })
                        }
                        else {
                            res.send(data);
                        }
                    })
            } else {
                res.status(404).send({
                    message: `Cannot find Book with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Book with id=" + id
            });
        });

};