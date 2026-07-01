const userController = require("../controller/userController");
const express = require('express');
const route = express.Router();

route.post("/add",userController.addUser);
route.post("/login",userController.loginUser);
route.post("/forget-password",userController.forgotPassword);
route.post("/reset-password",userController.resetPassword);
route.post("/verify-otp",userController.verifyOtp);

module.exports = route;