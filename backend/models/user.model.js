const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
      firstname: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
      },
      lastname: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill a valid email address"]
      },
      password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
      },
      canAccess: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      profilePhoto: {
        type: String,
        default: null
      },
      department:{
        type : String,
        default : "not assigned"
      },
      project:{
        type : String,
        default : "not assigned"
      }
    },
    { timestamps: true } 
  );

const User = mongoose.model("User", userSchema);
module.exports = User;