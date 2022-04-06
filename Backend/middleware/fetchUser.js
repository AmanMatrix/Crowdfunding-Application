const jwt = require("jsonwebtoken");
const jwt_secret = "shhhhh"; //change it later and store securely

const fetchUser = (req,res,next) =>{
    //get the user from jwt token and add id to req
    const token = req.header('auth-token');
    if(!token)
    {
        res.status(401).send({error : "authenticate using a valid token"});
    }
    try {
        const data = jwt.verify(token,jwt_secret);
        req.user = data;
        //console.log(data);
        next();
    } catch (error) {
        res.status(401).send({error : "authenticate using a valid token"});
    }
   
}

module.exports = fetchUser;