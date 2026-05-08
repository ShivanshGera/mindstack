const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
    try {

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,

            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // Send mail
        const info = await transporter.sendMail({
            from: `"MindStack" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: title,
            html: body,
        });

        console.log("Email sent successfully:", info.response);

        return info;

    } catch (error) {

        console.log("Email sending failed");
        console.log(error);

    }
};

module.exports = mailSender;