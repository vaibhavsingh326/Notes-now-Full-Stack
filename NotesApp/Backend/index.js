const express = require("express");
require("dotenv").config();
const connection = require("./db/connection.js");
const {noteRouter} = require("./routes/note.routes.js");
const userRouter = require("./routes/user.routes.js");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/users",userRouter)
app.use("/notes",noteRouter)

app.listen(process.env.PORT || 3000,async()=>{
    try{
        await connection
    console.log(`server running at http://localhost:${process.env.PORT}`);
    }catch(err){
        console.log(err);
    }
});