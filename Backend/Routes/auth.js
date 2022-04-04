const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const jwt_secret = "shhhhh"; //change it later and store securely

//Create a user using POST "/api/auth/"
router.post(
  "/",
  [
    body("email").isEmail().withMessage("Enter valid email!!"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be atleast 6 characters long !!"),
  ],
  async (req, res) => {
    //if errors occur, returns bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        res.status(400).json({ error: "Email already in use" });
      } else {
        //   Creating hash from password and adding salt
        const salt = await bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        //   Creating a new user
        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        });
        // Generating a JWT
        const authtoken = jwt.sign({ id: user.id }, jwt_secret);
        res.json({ authtoken });
      }
    } catch {
      return res.status(500).json({ error: "Some error occured" });
    }
  }
);

module.exports = router;
