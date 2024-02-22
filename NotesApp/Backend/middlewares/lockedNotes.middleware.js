const jwt=require("jsonwebtoken");
const notesAuth =  (req, res, next) => {
   const noteToken = req.headers.noteToken.split(" ")[1];

   if (noteToken) {
      jwt.verify(noteToken, process.env.JWT_SECRET, (err, decoded) => {
         if (decoded) {
            next();
         } else {
            res.send({ msg: "you are not authorized" });
         }
      });
   }else{
       res.send({ msg: "Please enter the password for the notes" });
   }
}

module.exports = { notesAuth };
