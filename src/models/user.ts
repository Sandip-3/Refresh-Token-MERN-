import mongoose from "mongoose";

const Schema = mongoose.Schema

const userSchema = new Schema({
    userName: {
        type: String,
        required : [true , "User name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique : [true , 'Email must be unique']
    },
    password: {
        type: String,
        required : [true , "Password is required"]
    },
    role: {
        type: [String],
        enum: ["user", "admin"],
        default : ["user"]
    }
}, {timestamps : true})

const User = mongoose.model("User", userSchema)

export default User