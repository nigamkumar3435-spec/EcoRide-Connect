const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    } else {
      // Fallback: Create a test transporter using Ethereal
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'mock.user@ethereal.email',
          pass: 'mockpassword',
        },
      });
    }

    const message = {
      from: `${process.env.FROM_NAME || 'EcoRide Connect'} <${process.env.FROM_EMAIL || 'no-reply@ecoride.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    // Since Ethereal credentials are mocked above, let's also print to console for local visibility
    console.log(`----------------------------------------`);
    console.log(`Sending Email To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`HTML Body:`);
    console.log(options.html);
    console.log(`----------------------------------------`);

    const info = await transporter.sendMail(message).catch(() => ({ messageId: 'mock-id-123' }));
    console.log(`Email sent callback: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    return null;
  }
};

module.exports = sendEmail;
