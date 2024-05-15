import mongoose from "mongoose";

const Schema = mongoose.Schema

const userToken = new Schema({
    userId: {
        type: Schema.ObjectId,
        required : true
    },
    token: {
        type: String,
        require : true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires : 30 *86400
    }
})

const Token = mongoose.model("Token", userToken)

export default Token