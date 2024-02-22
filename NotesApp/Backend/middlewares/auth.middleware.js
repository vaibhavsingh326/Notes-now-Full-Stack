const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if(decoded){
                req.body.userID = decoded.userID
                //console.log(req.body.userID)
                req.body.author = decoded.author
                next()
            }else{
                res.send({"msg":"you are not authorized"})
            }
        })
    }else{
        res.send({"msg":"Please login first"})
    }
}

module.exports = {auth}