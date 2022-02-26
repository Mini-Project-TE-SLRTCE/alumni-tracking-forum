const nodemailer = require("nodemailer");
const { GMAIL, GMAIL_PWD } = require("../utils/config");

// configuring sender
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: GMAIL,
    pass: GMAIL_PWD
  }
});

// function to send email
const sendEmail = async ({ emailTo, emailSubject, emailText }) => {
  // header, subject, body, etc. of email
  const emailOptions = {
    from: GMAIL,
    to: emailTo,
    subject: emailSubject,
    text: emailText
  }

  // sending email
  const res = await transporter.sendMail(emailOptions)
    .then(res => {
      return {
        status: 200,
        msg: res
      };
    })
    .catch(err => {
      return {
        status: 400,
        msg: err
      };
    });

  console.log("Send Email Function:");
  console.log(res);

  return res;
}

module.exports = sendEmail;
