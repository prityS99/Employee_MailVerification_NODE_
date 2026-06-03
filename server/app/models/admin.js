const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin", "employee"],
    required: true
  },

  isVerified: {
    type: Boolean,
    default: function () {
      return this.role === "employee"; 
    }
  },

  isDeleted: { 
    type: Boolean, 
    default: false 
  },

  deletedAt: { 
    type: Date 
  },

  isFirstLogin: {
    type: Boolean,
    default: function () {
      return this.role === "employee";
    }
  },

  verificationOTP: String,
  verificationOTPExpiry: Date
}, { timestamps: true });


const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
