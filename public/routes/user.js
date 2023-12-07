const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport = require("passport");
const { savedRedirectedUrl } = require("../middlewares.js");


router.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
});

//here we are using the try catch block to flash a message 
// so that we will be in the same page even though we have got some error 
router.post("/signup",savedRedirectedUrl ,async(req,res,next) => {
    try{
        let {username,password,email} =req.body;
    const newUser= new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    // we are calling the login for automatic login after the immediate signup
    req.login(registeredUser,(err) => {
        if(err) {
            return next(err);
        }
        req.flash("success" ,`Hi ${username} , Welcome To Wander Lust`);
        res.redirect("/listings");
    });
   
    }
    catch(err)
    {
        req.flash("error" ,err.message);
        res.redirect("/signup");
    }
});


router.get("/login" ,(req,res)=> {
    res.render("users/login.ejs");
});

router.post("/login",savedRedirectedUrl,
passport.authenticate('local', { 
    failureRedirect: '/login',
    failureFlash:true }) ,
    async(req,res)=> {
        // res.send("Welcome to Wander Lust ! You are successfully logged in ! ");
        req.flash("success","Welcome back to Wander Lust ! You are successfully logged in !");
        // res.redirect("/listings");
        // res.redirect(req.session.redirectedUrl);
        //the above redirect  gives a problem explained in middlewares.js
        let redirectUrl=res.locals.redirectedUrl || "/listings";
        res.redirect(redirectUrl);
});

router.get("/logout",(req,res)=> {
    req.logOut((err) => {
        if(err)
        {
          return next(err);
        }
        req.flash("success" ,"you are logged out now !");
        res.redirect("/listings");
    });
});

module.exports=router;

