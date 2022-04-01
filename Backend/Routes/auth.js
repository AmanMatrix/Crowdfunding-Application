const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//Create a user using POST "/api/auth/"
router.post('/', [
    body('email').isEmail().withMessage("Enter valid email!!"),
    body('password').isLength({min : 8}).withMessage("Password should be atleast 8 characters long !!")
] ,async (req,res)=>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()});
    }  
    //shsghsg
    try
    {
        let user = await User.findOne({email : req.body.email});
        if(user)
        {
            res.status(400).json({"error" : "Email already in use"});
        } 
        else
        {    
            user = await User.create({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password
            })

            res.send(user);
        }
    }catch{
        res.status(500).json({"error" : "Some error occured"});
    }    
    //res.send([]);
})

module.exports = router;