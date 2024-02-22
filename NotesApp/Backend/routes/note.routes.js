const express = require("express");
const  NoteModel  = require("../models/note.model.js");
const {notesAuth} = require("../middlewares/lockedNotes.middleware.js")
const {auth} = require("../middlewares/auth.middleware.js")

const noteRouter = express.Router();

noteRouter.get("/",auth, async (req, res) => {
    try {
        const result = await NoteModel.find({userID:req.body.userID});
        const notes =  result.reduce((acc,curr)=>{
            if(curr.type ==="locked"){
                console.log(curr.type);
                const note ={
                    _id:curr._id,
                    title:curr.title,
                }
                acc.push(note);
            }else{
                acc.push(curr);
            }
            return acc
        },[])
        console.log(notes);
        res.status(200).send({notes});
        
    } catch (error) {
        res.send({"error":"error"})
    }
   
})


noteRouter.get("/locked/:id",auth,notesAuth, async (req, res) => {
    const  _id = req.params.id;
    
    try {
        const note = await NoteModel.findOne(_id);
        res.status(200).send({note});
        
    } catch (error) {
        res.send(error)
    }
})

noteRouter.post("/",auth, async (req, res) => {
    try {
        const note = new NoteModel(req.body);
        await note.save()
        res.send({"msg":"note has been created"})
    } catch (error) {
        res.send(error)
    }
    
})
noteRouter.patch("/:id",auth, async (req, res) => {
    const  {id}  = req.params;
    try {
        const note = await NoteModel.findOne({ _id: id });
        if(note.userID===req.body.userID){
            await NoteModel.findByIdAndUpdate({ _id: id },req.body);
        res.send({"msg":`note with note id ${id} has been updated`})
        }else{
            res.send({"msg":"you are not authorized"})
        }
        
    } catch (error) {
        res.status(400).send({error})
    }
})

noteRouter.post("/unlock/",auth, async (req, res) => {
    const _id = req.body.userID
    const notePassword = req.body.notePassword
    try {
        const user = await UserModel.findOne({ _id });
        if(user){
            bcrypt.compare(notePassword, user.notePassword, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user._id, author: user.username }, process.env.JWT_SECRET,{expiresIn:"120"});
                    res.status(200).send({ "msg": "unlock success", "noteToken":token });
                } else {
                    res.status(200).send({ "msg": "unlock failed", "err": err });
                }
            })
        }
    } catch (error) {
        res.send({error})
    }
})

noteRouter.delete("/:id",auth, async (req, res) => {
    const { id } = req.params;
    try {
        const note = await NoteModel.findOne({ _id: id });
        if(note.userID===req.body.userID){
            await NoteModel.findByIdAndDelete({ _id: id }, req.body);
        res.send({"msg":`note with note id ${id} has been updated`})
        }else{
            res.send({"msg":"you are not authorized"})
        }
        
    } catch (error) {
        res.send({err})
    }
})

module.exports = {noteRouter}