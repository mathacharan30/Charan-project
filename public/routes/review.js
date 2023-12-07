const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");

const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview} = require("../middlewares.js");



// reviews- post route
router.post("/" , validateReview,wrapAsync( async (req,res) => {
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    //as we are changing the existing document we have to call the .save function
    await listing.save();
    req.flash("success","New Review Created !");
    // console.log("new review saved");
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);
}));

//reviews -delete route
router.delete("/:reviewId" ,wrapAsync( async(req,res) => {
    let {id, reviewId} =req.params;
    await Listing.findByIdAndUpdate(id, {$pull :{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;