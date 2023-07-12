const nodemailer = require('nodemailer');
const pug = require('pug');
const {htmlToText} = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.username = user.username;
        this.url = url;
        this.from = `Solid Clock <${process.env.EMAIL_FROM}>`;
    }

    newTransport() { // TODO: in .env set NODE_ENV=production before deploy
        if (process.env.NODE_ENV == 'production') {
            return nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USERNAME,
                    pass: process.env.GMAIL_PASSWORD,
                }
            })
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            }
        });
    }

    // send the actual email 
    async send(template, subject) {
        // 1. Render HTML based on a pug template
        const html = pug.renderFile(
            `${__dirname}/../views/emails/${template}.pug`, 
            {
                username: this.username,
                url: this.url,
                subject
            }
        );

        // 2. define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html)
        };

        // 3. create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send(
            'welcome', 
            'Welcome to the SolidRun family!'
            );
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset', 
            'Solid Clock - Your password reset token (valid only for 30 minutes)'
        );
    }
};
