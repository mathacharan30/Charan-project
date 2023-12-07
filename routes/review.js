const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");

const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middlewares.js");

const ReviewController=require("../controllers/review.js");

// reviews- post route
router.post("/",isLoggedIn , validateReview,wrapAsync(ReviewController.postReview ));

//reviews -delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor ,wrapAsync(ReviewController.deleteReview));

module.exports=router;