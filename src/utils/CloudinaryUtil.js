require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const uploadFileToCloudinary = async (file) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const cloudinaryRespose = await cloudinary.uploader.upload(file?.path);
    return cloudinaryRespose;
}

module.exports = {
    uploadFileToCloudinary,
    
}