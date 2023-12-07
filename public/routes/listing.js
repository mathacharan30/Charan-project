const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middlewares.js");


//index route to show all listings
router.get("/" ,wrapAsync( async(req,res) => {
    let allListings=await Listing.find({});
    res.render("listings/index.ejs" ,{allListings});
}));

// create new listing
//here we are using a passport method to check whether the user is logged in or not 
//the user should be logged in to post a listing 
//this is added in the middlewares.js file
router.get("/new",isLoggedIn, (req,res) => {
    // console.log(req.user);
    // if(!req.isAuthenticated())
    // {
    //     req.flash("error" ,"You must be logged in to create a listing ");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
});

//show route to show a particular listing
router.get("/:id" ,wrapAsync( async(req,res) => {
    let {id }= req.params;
   const listing=await Listing.findById(id).populate("reviews").populate("owner");
   if(!listing)
   {
    req.flash("error","The Listing Does Not Exist");
    res.redirect("/listings");
   }
   console.log(listing);
   res.render("listings/show.ejs" , {listing});
}));

//create a new listing
router.post("/",isLoggedIn ,validateListing, wrapAsync(async(req,res,next) => {
    //the below line was old method to extrat the key value pairs 
    // let {title,description,price,image,location,country} =req.body;
    //new method to directly create a new document in mongo db (below) 
    //some change has been done in the new.ejs page in the name of all the inputs

    //if the listing object is not send by the client then we throw the below error 
    //this also handled by JOI
    // if(!req.body.listing)
    // {
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    const newListing=new Listing(req.body.listing);
    //this error is handled by the JOI NPM PACKAGE
    //the below error is throwed to handle the server side validation ie, if description is missing then we throw err
    // if(!newListing.description)
    // {
    //     throw new ExpressError(400,"description is missing");
    // }
    newListing.owner=req.user._id;
    //req.user has the info of the user who is trying to add a listing
    await newListing.save();
    req.flash("success","New Listing Created !");
    res.redirect("/listings");
}));
//edit route
router.get("/:id/edit" ,isLoggedIn,isOwner,wrapAsync( async(req,res) => {
    let {id }= req.params;
   const listing=await Listing.findById(id);
   if(!listing)
   {
    req.flash("error","The Listing Does Not Exist");
    res.redirect("/listings");
   }
   res.render("listings/edit.ejs" , {listing});
}));

//update route
router.put("/:id",isLoggedIn,isOwner,validateListing ,wrapAsync(async(req,res) => {
    //this error is handled by the JOI
    // if(!req.body.listing)
    // {
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    let {id }= req.params;
    let listing=await Listing.findById(id);
    //this if block protects the listing from the requests from the hoppscotch
    // if(!listing.owner.equals(res.locals.currUser._id))
    // {
    //     req.flash("error","You dont have the permission to edit this listing ");
    //     return res.redirect(`/listings/${id}`);
    // }
    //we will call a middleware to check the owner
    let updatedListing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    console.log(updatedListing);
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route 
router.delete("/:id",isLoggedIn,isOwner ,wrapAsync (async(req,res) => {
    let {id }= req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));


module.exports=router;