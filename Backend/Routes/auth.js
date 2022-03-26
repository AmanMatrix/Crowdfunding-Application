const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//Create a user using POST "/api/auth/"
router.post('/', [
    body('id').custom(value => {
        return User.findOne({id : value}).then((user) => {
            if(user)
                return Promise.reject('ID already taken');
        })
    }),
    body('email').isEmail().withMessage("Enter valid email!!").custom(value => {
        return User.findOne({email : value}).then((docs) => {
            if(docs)
                return Promise.reject('EMAIL already taken');
        })
    }),
    body('password').isLength({min : 8}).withMessage("Password should be atleast 8 characters long !!")
] ,(req,res)=>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()});
    }
    User.create({
        id : req.body.id,
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    }).then(user => res.json(user))
    .catch(err => {
        console.log(err);
    });
    //res.send([]);
})

module.exports = router;