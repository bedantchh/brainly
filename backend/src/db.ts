import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv"
dotenv.config();

export const connect = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL not found in environment variables");
        }
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

const userSchema =  new Schema({
    username: {type:String, unique:true,require:true},
    password: {type:String, required: true}
})

const contentSchema = new Schema({
    "title" : String,
    "link": String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}

})

export const UserModel = model("User",userSchema)
export const ContentModel = model("Content",contentSchema)