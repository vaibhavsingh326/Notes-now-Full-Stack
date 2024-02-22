const mongoose = require("mongoose");
const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    userID: {
        type:String,
        required: true
    },
    author: {
       type: String,
       required: true 
    },
    type: {
        type: String,
        enum: ["unlocked", "locked"],
        default: "unlocked"
    }
} ,{versionKey:false,
    timestamps:true})
const NoteModel = mongoose.model("note", noteSchema);
module.exports = NoteModel