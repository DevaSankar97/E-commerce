const nodemailer = require('nodemailer');

const sendMail = async (option) => {
    const config = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }

    const transport = nodemailer.createTransport(config);

    await transport.sendMail({
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_MAIL}>`,
        to: option.email,
        subject: 'Password Reset',
        text: option.message
    });
}

module.exports = sendMail;


