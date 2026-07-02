import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config"

const REFRESS_SECRET = process.env.REFRESS_SECRET
const ACCESS_SECRET = process.env.ACCESS_SECRET

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
        default: "https://i.pinimg.com/236x/64/11/9b/64119b15e41f962e266fdc7719d67929.jpg",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true,
    });



export default mongoose.model("User", userSchema);