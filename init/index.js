const mongoose =require("mongoose");
const initData=require("./data.js");
const Listing =require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDB= async () => {
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj) => ({...obj,owner:"656494459883830dd811f2d0"}));
    //the above line adds a owner to all the listings in the data base 
    await Listing.insertMany(initData.data);
    console.log("the data was initialized");
};

initDB();