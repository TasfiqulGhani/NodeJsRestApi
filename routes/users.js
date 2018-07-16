var express = require('express');
var router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('get respond with a resource users');
});


router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name:req.body.name
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});





router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        'secret',
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});





router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    if (id === 'tashfik') {
        res.status(200).json({
            message: 'You Logged In.',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'Wrong credentials.'
        });
    }
});

router.patch('/:userId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated Id!'
    });
});

router.delete('/:userId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted id!'
    });
});




module.exports = router;
