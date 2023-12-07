const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middlewares.js");
const multer  = require('multer');
//dest is the destination where u want to store the images which u have uploaded from new listing
//now we can create a same folder in our system and save there but we use a cloud
const {storage}=require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/' });
const upload = multer({storage});


const listingController=require("../controllers/listing.js");

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn ,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));



// create new listing
//here we are using a passport method to check whether the user is logged in or not 
//the user should be logged in to post a listing 
//this is added in the middlewares.js file
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing ,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner ,wrapAsync (listingController.deleteListing));

//edit route
router.get("/:id/edit" ,isLoggedIn,isOwner,wrapAsync(listingController.editListing));

module.exports=router;