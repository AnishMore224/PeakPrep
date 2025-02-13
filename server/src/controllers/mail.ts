import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();
interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

const sendMail = async (mailOptions: MailOptions) => {
    try {
        console.log(process.env.EMAIL_HOST);
        console.log(process.env.USER_EMAIL);
        console.log(process.env.USER_PASSWORD);
        const transporter = nodemailer.createTransport({
            

            host: process.env.EMAIL_HOST, // Replace with your SMTP server
            port:465 , // Replace with your SMTP port
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.USER_EMAIL, // Replace with your email
                pass: process.env.USER_PASSWORD, // Replace with your email password
            },
        });


        const info = await transporter.sendMail(mailOptions);

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        return error;
    }

};

export const sendVerificationMail = async (Request: any, Response: any) => {
    const { email, verificationCode } = Request.body;
    const mailOptions = {
        from: process.env.USER_EMAIL as string,
        to: email,
        subject: 'Verify your email',
        html: `<p>Your verification code is <strong>${verificationCode}</strong></p>`,
    };
    console.log(mailOptions);
    const result = await sendMail(mailOptions);
    if (result instanceof Error) {
        return Response.status(500).send('Failed to send verification email');
    }
    Response.status(200).send('Verification email sent');
};

export const sendPasswordResetMail = async (Request: any, Response: any) => {
    const { email, resetCode } = Request.body;
    const mailOptions = {
        from: process.env.USER_EMAIL as string,
        to: email,
        subject: 'Reset your password',
        text: `Your password reset code is ${resetCode}`,
    };
    await sendMail(mailOptions);
    Response.status(200).send('Password reset email sent');
};

