import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,  'user name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true,  'email is required'],
        unique: [true, 'email is required'],
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email address."]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: 6
    }
}, { timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;