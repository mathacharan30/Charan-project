const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport = require("passport");
const { savedRedirectedUrl } = require("../middlewares.js");

const userController=require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignUp )
.post(savedRedirectedUrl ,userController.signUp);




router.route("/login")
.get(userController.renderLogin)
.post(savedRedirectedUrl,
passport.authenticate('local', { 
    failureRedirect: '/login',
    failureFlash:true }) ,
    userController.login);


//logout
router.get("/logout",userController.logOut);

module.exports=router;

