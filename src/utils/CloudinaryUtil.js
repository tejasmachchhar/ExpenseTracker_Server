const cloudinary = require('cloudinary').v2;

const uploadFileToCloudinary = async (file) => {
    //conif
    cloudinary.config({
        cloud_name: 'dtmmuqupc',
        api_key: '835255254355426',
        api_secret: 'qgAG8piqYxoVAkZ1WBjkv59zRwY'
    });
    const cloudinaryRespose = await cloudinary.uploader.upload(file?.path);
    return cloudinaryRespose;
}

module.exports = {
    uploadFileToCloudinary,
    
}