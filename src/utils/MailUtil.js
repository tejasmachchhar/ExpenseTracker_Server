const mailer = require('nodemailer');

const sendingMail = async(to, subject, text) => {
    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tejasmachchhar9401@gmail.com',
            pass: '0904tejas',
        }
    });

    const mailOptions = {
        from: 'tejasmachchhar9401@gmail.com',
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