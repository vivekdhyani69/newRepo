const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const { sendResetEmail } = require('../utils/mailer');
const crypto = require('crypto');
const sendEmail = require('../utils/mailer');
const register = async (req, res) => {

  const { name, username, password ,email} = req.body;

  // Validate password
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(password)) {
    return res.status(400).json({ error: 'Password must be 7 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.' });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, username,email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with success
    res.status(201).json({ token, message: 'User created successfully!' ,newUser});

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

//makes the login api and creates a jwt token 
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
      // Find user by username
      const user = await User.findOne({ username });

      // Check if user exists and password is correct
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      // Respond with the token
      res.status(200).json({user:user, token });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
  }
};


const forgotPassword = async (req, res) => {


  console.log(req.body);

try {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Generate a reset token (unique and sh ort-lived)
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Calculate the reset token expiration time (10 minutes from now) in Unix timestamp
const resetTokenExpiry = Math.floor(Date.now() / 1000) + 600; // 600 seconds for 10 minutes


  // Update user with the reset token and expiry
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetTokenExpiry;
  await user.save();

  // Construct the reset link with the token
 // Send an email with a reset link containing the reset token
 const resetLink = `${process.env.REACT_APP_PUBLIC_BASE_URL}/reset-password/${resetToken}`;



  const data = { name:email, resetLink };


  const options = {
    email,
    subject: "Reset Your Password",
    html: `<p>Click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    data
  };

  sendEmail(options);

  res.status(200).json({
    message: "Check your mail!",
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
}
};

const resetPassword = async(req,res)=>{
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    // resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successfully' });
}

module.exports = { register, login,forgotPassword ,resetPassword};