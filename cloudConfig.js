//we will write all the configurations so that our backend will access the cloud file and then store all the images in that file
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//we are joining the cloud info with the backend 
//for this we  config things 
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ["png","jpg","jpeg"],
    },
  });

module.exports={
    cloudinary,
    storage
}