import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

export const configureEmail = () => {
  // Configure email settings from Meteor settings
  const mailUrl = Meteor.settings.mail?.url;
  if (mailUrl) {
    process.env.MAIL_URL = mailUrl;
  }

  // Configure email templates
  Accounts.emailTemplates.siteName = "Social Web App";
  Accounts.emailTemplates.from = Meteor.settings.mail?.from || "Social Web App <noreply@socialwebapp.com>";

  // Reset password email template
  Accounts.emailTemplates.resetPassword = {
    subject(user) {
      return "Reset Your Password";
    },
    text(user, url) {
      // Replace hash with pathname for proper URL formatting
      const newUrl = url.replace('#/', '');
      return `Hello,\n\nTo reset your password, simply click the link below:\n\n${newUrl}\n\nIf you did not request this reset, please ignore this email.\n\nThanks,\nSocial Web App Team`;
    },
    html(user, url) {
      // Replace hash with pathname for proper URL formatting
      const newUrl = url.replace('#/', '');
      return `
        <html>
          <body>
            <p>Hello,</p>
            <p>To reset your password, simply click the link below:</p>
            <p><a href="${newUrl}">Reset Password</a></p>
            <p>If you did not request this reset, please ignore this email.</p>
            <p>Thanks,<br/>Social Web App Team</p>
          </body>
        </html>
      `;
    }
  };
};
