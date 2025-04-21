require('dotenv').config();
const mailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;

const sendingMail = async(to, subject, text) => {
    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
    }

    const mailresponse = await transporter.sendMail(mailOptions);
    console.log(mailresponse);
    return mailresponse;
}

module.exports = {
    sendingMail
}
//sendingMail("tejasmachchhar0904@gmail.com","Test Mail","this is test mail")