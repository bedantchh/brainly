import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv"
dotenv.config();

mongoose.connect(process.env.MONGO_URL as string)
const userSchema =  new Schema({
    username: {type:String, unique:true,require:true},
    password: {type:String, required: true}
})

export const UserModel = model("User",userSchema)