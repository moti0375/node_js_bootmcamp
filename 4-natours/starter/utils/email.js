const nodemailer = require('nodemailer');

module.exports = async options => {
  console.log(`Send email was called: ${JSON.stringify(options)}`);
  //1. Create Transported
  console.log(`Email credentials: host: ${process.env.EMAIL_HOST}, port: ${process.env.EMAIL_PORT}`);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    //Activate in gmail "less secure app" option
  });
  console.log(`transporter created...`);

  //2. Define mail options
  const mailOptions = {
    from: 'Moti Bartov <moti0375@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    //html..
  };
  //3. Send the email
  await transporter.sendMail(mailOptions);
  console.log(`Mail sent`);
};
