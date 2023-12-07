const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next) => {
    // console.log(req.user);
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error" ,"You must be logged in to create or modify listing");
        return res.redirect("/login");
    }
    next();
}
// we are using the req.originalUrl to redirect to the path from where the login was called 
//ie if a user was trying to add a listing and we directed him to the login page so after login we will redirect the 
// user to the same add listing page 
// we are creating the new object in session to store the original url
//req.session.redirectUrl=req.originalUrl
//the above written method will give us a problem and that is when ever islogged in middleware is called 
//and this gives a success message to the login page after signup passport will reset the req.session so we will not be able to get the url 
// so we use another middleware to encounter
//we use the local variable to store and this local variable can be accessed anywhere

module.exports.savedRedirectedUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectedUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next) => {
    let {id }= req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//this function is passed as a middle ware for the server side validation for listing schema
module.exports.validateListing=(req,res,next) => {
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el) => el.message ).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


//this function is passed as a middle ware for the server side validation for listing schema
module.exports.validateReview=(req,res,next) => {
    let {error}=reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el) => el.message ).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//this is to check the author of the review
module.exports.isReviewAuthor=async(req,res,next) => {
    let {id,reviewId}= req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id))
    {
        req.flash("error","You did not create this review ");
        return res.redirect(`/listings/${id}`);
    }
    next();
}