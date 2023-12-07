const User=require("../models/user.js");
const passport = require("passport");

module.exports.renderSignUp=(req,res)=> {
    res.render("users/signup.ejs");
}

module.exports.renderLogin=(req,res)=> {
    res.render("users/login.ejs");
}

module.exports.signUp=async(req,res,next) => {
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
}

module.exports.login=async(req,res)=> {
    // res.send("Welcome to Wander Lust ! You are successfully logged in ! ");
    req.flash("success","Welcome back to Wander Lust ! You are successfully logged in !");
    // res.redirect("/listings");
    // res.redirect(req.session.redirectedUrl);
    //the above redirect  gives a problem explained in middlewares.js
    let redirectUrl=res.locals.redirectedUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logOut=(req,res)=> {
    req.logOut((err) => {
        if(err)
        {
          return next(err);
        }
        req.flash("success" ,"you are logged out now !");
        res.redirect("/listings");
    });
}