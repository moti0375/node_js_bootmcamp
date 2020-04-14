const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Natours, Moti Bartov <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
      //Activate in gmail "less secure app" option
    });
  }

  async send(template, subject) {
    //1) Render the email based on pug template
    const tmpl = `${__dirname}/../views/email/${template}.pug`;
    console.log(`Send js: ${tmpl}`);
    const html = pug.renderFile(tmpl, {
      firstName: this.firstName,
      url: this.url,
      subject: subject
    });

    //2) Defind email option
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: htmlToText.fromString(html),
      html: html
      //html..
    };
    //3. Send the email
    const transport = this.createTransport();
    await transport.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours');
  }

  async sendResetPassword() {
    await this.send('password', 'Natours Reset Password: valid for next 10 min');
  }
};
