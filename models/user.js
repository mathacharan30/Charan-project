const mongoose= require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
    // here passport local will add a username and a password by itself 
    // so no need to define those things again
});

userSchema.plugin(passportLocalMongoose);
//the above line written will automatically implement the hashing feature and salting 
// with a username by default
//it will also implement some methods u can check out npm documentaation 
module.exports = mongoose.model('User', userSchema);