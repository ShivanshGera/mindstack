const nodemailer = require("nodemailer");
require("dotenv").config();

const maskEmail = (email = "") => {
    const [name, domain] = String(email).split("@");
    if (!name || !domain) return "<invalid-email>";
    return `${name.slice(0, 2)}***@${domain}`;
};

const getTransporterConfig = () => {
    const host = process.env.SMTP_HOST || process.env.MAIL_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || process.env.MAIL_PORT || 587);
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;

    if (!host || !port || !user || !pass) {
        throw new Error("Missing SMTP configuration. Required: SMTP_HOST/MAIL_HOST, SMTP_PORT, MAIL_USER, MAIL_PASS");
    }

    return {
        host,
        port,
        secure: port === 465,
        requireTLS: port !== 465,
        auth: {
            user,
            pass,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 30000,
    };
};

const safeTransporterConfig = (config) => ({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    connectionTimeout: config.connectionTimeout,
    greetingTimeout: config.greetingTimeout,
    socketTimeout: config.socketTimeout,
    auth: {
        user: maskEmail(config.auth.user),
        passSet: Boolean(config.auth.pass),
        passLength: config.auth.pass ? config.auth.pass.length : 0,
    },
});

const mailSender = async (email ,title ,body) => {
    try{
        const transporterConfig = getTransporterConfig();
        console.log("[mailSender] SMTP config", safeTransporterConfig(transporterConfig));
        console.log("[mailSender] Preparing email", {
            to: maskEmail(email),
            subject: title,
        });

        const transporter = nodemailer.createTransport(transporterConfig);

        await transporter.verify();
        console.log("[mailSender] SMTP server ready");

        const info = await transporter.sendMail({
            from: `"MindStack" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body,
        });

        console.log("[mailSender] Email sent", {
            messageId: info.messageId,
            response: info.response,
            accepted: info.accepted,
            rejected: info.rejected,
        });
        return info;

    }
    catch(error){
        console.error("[mailSender] Email failed", {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode,
            errno: error.errno,
            address: error.address,
            port: error.port,
            stack: error.stack,
        });
        throw error;
    }
}

module.exports = mailSender;
