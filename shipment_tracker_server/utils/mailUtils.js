const { IS_PRODUCTION } = require('../config/environment');
const axios = require('axios');
const { MIDDLEWARES_ATTRIBUTES : { AUTH : AUTH_MIDDLEWARE_ATTR }} = require('../constants/modelConstants')
const { SEND_PASSWORD_EMAILS, SEND_PASSWORD_RECOVERY_EMAIL} = require('../Settings')

async function sendBrevoEmail({ to, subject, html }) {
  return axios.post('https://api.brevo.com/v3/smtp/email', {
    sender: { email: process.env.FROM_EMAIL },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  }, {
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
  });
}

function sendPasswordRecoveryEmail(email, token) {
  if (!SEND_PASSWORD_RECOVERY_EMAIL) return;

  const port = process.env.FRONTEND_PORT;
  const link = port === '80'
    ? `${process.env.FRONTEND_HOST}/resetpassword?${AUTH_MIDDLEWARE_ATTR.RESET_PASSWORD_TOKEN}=${token}`
    : `${process.env.FRONTEND_HOST}:${port}/resetpassword?${AUTH_MIDDLEWARE_ATTR.RESET_PASSWORD_TOKEN}=${token}`;

  return sendBrevoEmail({
    to: email,
    subject: 'Password Reset Request',
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0;">
      <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background-color: #3f51b5; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Shipment Tracker</h1>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="color: #333333; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #555555; font-size: 15px; line-height: 1.6;">
            We received a request to reset the password for your account. Click the button below to choose a new password.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${link}" style="background-color: #3f51b5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-size: 16px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #888888; font-size: 13px; line-height: 1.6;">
            If you did not request a password reset, you can safely ignore this email. Your password will not be changed.
          </p>
          <p style="color: #888888; font-size: 13px; line-height: 1.6;">
            If the button above doesn't work, copy and paste this link into your browser:
            <br/>
            <a href="${link}" style="color: #3f51b5; word-break: break-all;">${link}</a>
          </p>
        </div>
        <div style="background-color: #f4f4f4; padding: 20px 32px; text-align: center;">
          <p style="color: #aaaaaa; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Shipment Tracker. All rights reserved.</p>
        </div>
      </div>
    </div>`,
  });
}

async function sendPasswordEmail(email, password) {
  if (!SEND_PASSWORD_EMAILS && !IS_PRODUCTION) return Promise.resolve();

  return sendBrevoEmail({
    to: email,
    subject: 'Your account password',
    html: `<div style="padding:20px">
      <p>Your password is: <strong style="color:green">${password}</strong></p>
    </div>`,
  });
}

module.exports = {
  sendPasswordRecoveryEmail,
  sendPasswordEmail
}