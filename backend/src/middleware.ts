import mongoose, { model, Schema } from "mongoose";
mongoose.connect("mongodb+srv://bedantchhetri7:8SyP5ucs3eRHd701@cluster0.hwaqh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
const userSchema =  new Schema({
    username: {type:String, unique:true,require:true},
    password: {type:String}
})

export const UserModel = model("User",userSchema)