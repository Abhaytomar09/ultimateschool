const nodemailer = require('nodemailer');

/**
 * Sends an email using Nodemailer
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body of the email
 */
const sendEmail = async (options) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️  EMAIL_USER or EMAIL_PASS not set in .env. Skipping email sending.');
            return false;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to 'smtp-mail.outlook.com' etc if not using Gmail
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"UltimateSchool" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent successfully to ${options.to} (Message ID: ${info.messageId})`);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return false;
    }
};

module.exports = sendEmail;
