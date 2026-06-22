// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // Prevents password from being returned in normal API queries automatically
    },
    role: {
      type: String,
      enum: ['victim', 'police', 'bank_admin'],
      required: true,
    },
    // Namespaced details so we don't clog up documents with unneeded fields
    roleDetails: {
      jurisdiction: {
        district: String,
        stationName: String,
      },
      bankCode: {
        type: String, // e.g., 'SBI', 'HDFC'
      },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Encrypt password using bcrypt before saving to database
// Encrypt password using bcrypt before saving to database
UserSchema.pre('save', async function () {
  // If the password field wasn't modified, skip hashing
  if (!this.isModified('password')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare entered password with hashed password in DB
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);