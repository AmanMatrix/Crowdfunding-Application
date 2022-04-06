const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const jwt_secret = "shhhhh"; //change it later and store securely
var fetchUser = require("../middleware/fetchUser");


//Create a user using POST "/api/auth/"
router.post(
    "/newUser",
    [
        body("email").isEmail().withMessage("Enter valid email!!"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password should be atleast 6 characters long !!"),
    ],
    async (req, res) => {
        //if errors occur, returns bad request
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        else {
            try {
                let user1 = await User.findOne({ email: req.body.email });
                let user2 = await User.findOne({ username: req.body.username });
                if (user1 || user2) {
                    if (user1 && user2) {
                        res.status(400).json({ error: "Email and username already in use" });
                    }
                    else {
                        if (user1)
                            res.status(400).json({ error: "Email already in use" });
                        else
                            res.status(400).json({ error: "Username already in use" });
                    }
                } else {
                    //   Creating hash from password and adding salt
                    const salt = await bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(req.body.password, salt);

                    //   Creating a new user
                    let user = await User.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        username: req.body.username
                    });
                    // Generating a JWT
                    const authtoken = jwt.sign({ id: user.id }, jwt_secret);
                    res.json({ authtoken });
                }
            } catch {
                return res.status(500).json({ error: "Some error occured" });
            }
        }
    }
);


//authenticate a user using POST "/api/auth/login"
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Enter valid email"),
        body("password").exists().withMessage("Password cannot be empty")
    ],
    async (req, res) => {
        //if errors occur, returns bad request
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        else {
            try {
                let user = await User.findOne({ email: req.body.email });
                if (!user) {
                    return res.status(400).json({ errors: "Enter correct credentials" });
                }
                else {
                    const passwordCompare = await bcrypt.compare(req.body.password, user.password);
                    if (!passwordCompare) {
                        return res.status(400).json({ errors: "Enter correct credentials" });
                    }
                    else {
                        const payload = {
                            id: user.id
                        }
                        const authtoken = await jwt.sign({ id: user.id }, jwt_secret);
                        res.json({ authtoken });
                    }
                }
            } catch (error) {
                return res.status(500).json({ error: "Some error occured" });
            }
        }
    }
);

//get a logged in user details using POST "/api/auth/getUser"
router.post(
    "/getUser",fetchUser,
    async (req, res) => {
        //if errors occur, returns bad request
        try {
            let userId = req.user.id;
            //console.log(userId);
            const user = await User.findById(userId).select("-password");
            res.send(user);
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Some error occured" });
        }
    }
      
);

module.exports = router;
