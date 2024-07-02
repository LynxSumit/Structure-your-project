import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    clientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Client",
        required : true
    },
    status : {
        type : String,
        enum : ["PENDING", "DONE" , "IN PROGRESS"],
        default : "PENDING"
    }
} , {timestamps : true})

export const Project = mongoose.model("Project" , projectSchema)