//we are using the if block because things written in the .env file should not go to production 
//production means if u upload this to github no one should have the credentials of the cloud account

if(process.env.NODE_ENV != "production")
{
    require('dotenv').config();
}
//accessing the environment variables stored in  the .env file
// console.log(process.env.SECRET);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


// const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
const dbUrl=process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"views"));
//here we were using the express parser to parse the form data 
// as we are uploading the image we use another package called multer
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET,
      },
      touchAfter:24*60*60,
});

store.on("error",() => {
    console.log("ERROR in mongo ession store",err);
})

const sessionsoptions={
    //store means the variable written above
    store,
    secret:process.env.SECRET,
    rresave:false,
    saveUninialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        //this is used for cross scripting attacks ,http only 
    }
};
// app.get("/" ,(req,res) => {
//     res.send("Hi i am root");
// });



app.use(session(sessionsoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//the above line says that the passport will makesure that the users will login/signup through this User.authenticate() method 
//we use the local strategey of passport for thos purpose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//the above methods are used  to store the user's info till the end of the session and removing it after his session is completed
//please read the passport docs once to understand the above features

//this is a middle ware to use the connect-flash feature 
app.use((req,res,next) => {
    //in listing.js route we have a request for falsh when ever the key of flash is success then we call this middleware
    // the message will be saved in that variable res.locals 
    //that  we will access in the index route see in the views folder
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // console.log(res.locals.success);
    next();
});

// app.get("/demouser",async(req,res) => {
//     let fakeUser=new User({
//         email:"student@gmil.com",
//         username:"delta-student"
//     });
//     //this is a method to register a user into the website via passport
//     //register (user,password,cb) =>cb is any callback if u want to use after the registartion
//     const registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/" , userRouter);


// app.get("/testListing",async(req,res) => {
//     let sampleListing=new Listing({
//        title:"My new Resort",
//         description:"By the beach",
//         price:1200,
//         location:"calangunte,Goa",
//         country:"India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

// * says all the routes except the routes written above
app.all("*" ,(req,res,next) => {
    next(new ExpressError(404,"Page Not Found !"));
})

app.use((err,req,res,next) => {
    let {statusCode=500,message="Something went worng !"} =err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("The server is listening to port 8080");
});

