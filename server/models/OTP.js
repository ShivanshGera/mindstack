const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:8*60,
    }
});

//function -> to send emails
async function sendVerificationEmail(email,otp) {
    try{
        const mailResponse = await mailSender(email,"Verification email from MindStack", otpTemplate(otp));
        console.log("Email sent successfully", {
            messageId: mailResponse.messageId,
            response: mailResponse.response,
        });

    }
    catch(error){
        console.error("Error occurred while sending OTP email:", {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode,
        });
        throw error;
    }
}

OTPSchema.pre("save",async function (){
    await sendVerificationEmail(this.email,this.otp);
   // next();
})

module.exports = mongoose.model("OTP",OTPSchema);
