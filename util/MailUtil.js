const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

console.log("EMAIL =", process.env.EMAIL);
console.log("APP_PASS =", process.env.APP_PASS);

const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.APP_PASS
    }
})

const sendMail = async(to,subject,text)=>{
    try{
        const info = await transporter.sendMail({
            from:process.env.email,
            to,
            subject,
            text
        })
        console.log("Email sent:", info.response);

    }catch(error){
        console.error("Error sending email:", error);
    }
}



module.exports = {
    sendMail
}