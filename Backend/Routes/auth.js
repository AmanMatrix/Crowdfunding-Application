const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//Create a user using POST "/api/auth/"
router.post('/', [
    body('email' , 'Enter valid email').isEmail(),
    body('password' , 'Weak password').isLength({min : 8})
] ,(req,res)=>
{
    //console.log(req.body);
    //const user = User(req.body);
    //user.save();
    //res.json({});
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
        res.json({error : "id or email already taken"});
    });
    //res.send([]);
})

module.exports = router;