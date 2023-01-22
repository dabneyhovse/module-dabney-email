/**
 * Author:	Nick Jasinski
 * Date:		2022-09-08
 *
 * Simple email sending module local to the dabney services
 * this was created so that it is easy for services to send
 * emails via the dcomptrollers@dabney.caltech.edu mail.
 *
 * It would be easy to send fake emails with this module,
 * but honor code and comptroller code review
 */

const nodemailer = require("nodemailer");
require("dotenv").config();

const COMPTROLLER_EMAIL = "comptrollers@dabney.caltech.edu";

const smtpTransport = nodemailer.createTransport({
  host: "127.0.0.1",
  port: 587,
  secure: false,
  tls:{
    servername:"mail.dabney.caltech.edu",
  },
});

/**
 * Sends an email via comptrollers@dabney.caltech.edu
 *
 * @param {string} to The email address to send to
 * @param {string} subject The subject line of the email
 * @param {string} html The html to be sent in the email (can also be plain text)
 * @returns Promise
 */
async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: COMPTROLLER_EMAIL,
    to,
    subject,
    generateTextFromHTML: true,
    html: html,
    tls: { 
      rejectUnauthorized: false,
    },
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
