const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
    try {

        console.log("MAIL_HOST:", process.env.MAIL_HOST);
        console.log("MAIL_USER:", process.env.MAIL_USER);

        // Create transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            requireTLS: true,

            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },

            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });

        // Verify SMTP connection
        await transporter.verify();
        console.log("SMTP server is ready");

        // Send email
        let info = await transporter.sendMail({
            from: `"MindStack" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body,
        });

        console.log("Email sent successfully");
        console.log(info.response);

        return info;

    } catch (error) {

        console.log("EMAIL ERROR:");
        console.log(error);

        return error;
    }
};

module.exports = mailSender;