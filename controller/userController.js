const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const MailUtil = require("../util/MailUtil");

const addUser = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await userModel.create({ ...req.body, password: hashedPassword });
    if (newUser) {
        res.status(201).json({
            message: "User created successfully",
            data: newUser
        });
    }
    else {
        res.status(400).json({
            message: "User creation failed",
            error: newUser
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                data: null
            });
        }

        console.log("password ...", password);
        console.log("pass...", user.password);



        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return res.status(200).json({  // Use 200 for successful login
                message: "Login successful",
                data: user
            });
        }
        else{
            return res.status(400).json({
                message: "Invalid credentials",
                data: null
            });
        }



    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};

let resetTokens = {}; // { email: token }

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // const resetToken = Math.random().toString(36).slice(-8); 
  const resetToken = Math.floor(100000 + Math.random() * 900000)
  console.log("Email:", email);   //1000000
console.log("OTP:", resetToken);
  resetTokens[email] = resetToken;

  try {
    await MailUtil.sendMail(
      email,
      "Password Reset Request",
      `Your password reset code is ${resetToken}`,
      `<p>Your password reset code is <b>${resetToken}</b></p>`
    );

    res.status(200).json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, resetToken } = req.body;
   console.log("Email:", email);
  console.log("OTP from frontend:", resetToken);
  console.log("OTP stored:", resetTokens[email]);

  
  // Check if we have a stored token
  if (!resetTokens[email]) {
    return res.status(400).json({ error: "No OTP found or OTP expired" });
  }

  // Check if the provided token matches
  if (resetTokens[email] != resetToken) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // If matched, send success response
  res.status(200).json({ message: "OTP verified successfully", success: true });
};


const resetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.updateOne({ email }, { password: hashedPassword });

  res.status(200).json({ message: "Password reset successful" });
};



module.exports = {
    addUser,
    loginUser,
    forgotPassword,
    resetPassword,
    verifyOtp
}