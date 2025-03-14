const mailer = require('nodemailer');

const sendingMail = async(to, subject, text) => {
    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        }
    });

    const mailOptions = {
        from: '',
        to: '',
        subject: '',
        txt: '',
    }

    const mailresponse = await transporter.sendMail(mailOptions);
    console.log(mailresponse);
    return mailresponse;
}

module.exports = {
    sendingMail
}