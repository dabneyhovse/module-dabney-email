/**
 * Author:	Nick Jasinski
 * Date:		2022-09-08
 *
 * Simple email sending module local to the dabney services
 * this was created so that it is easy for services to send
 * emails via the dabney.comptrollers@gmail.com mail.
 *
 * It would be easy to send fake emails with this module,
 * but honor code and comptroller code review
 */

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const OAuth2 = google.auth.OAuth2;
const COMPTROLLER_EMAIL = "dabney.comptrollers@gmail.com";

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID, // ClientID
  process.env.CLIENT_SECRET, // Client Secret
  process.env.REDIRECT_URL // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const accessToken = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: COMPTROLLER_EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: accessToken,
  },
});

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: COMPTROLLER_EMAIL,
    to,
    subject: "Node.js Email with Secure OAuth",
    generateTextFromHTML: true,
    html: html,
  };

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, (error, response) => {
      smtpTransport.close();
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

module.exports = sendEmail;
