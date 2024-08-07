// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },//It is unique 
  password: { type: String, required: true },
  email: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  leads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }], // Array of references to Lead documents
});

module.exports = mongoose.model('Users', userSchema);
