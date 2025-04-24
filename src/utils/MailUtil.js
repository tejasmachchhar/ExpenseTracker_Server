require('dotenv').config();
const mailer = require('nodemailer');

const sendingMail = async(to, subject, text) => {
    try {
        const transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // This should be an App Password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
        }

        const mailresponse = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return mailresponse;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email: ' + error.message);
    }
}

module.exports = {
    sendingMail
}