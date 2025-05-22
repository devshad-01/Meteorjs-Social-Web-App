import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { configureEmail } from '/imports/startup/server/email-config';
import '/imports/api/users/methods';

Meteor.startup(async () => {
  // Configure email settings
  configureEmail();

  // Configure account settings
  Accounts.config({
    sendVerificationEmail: false,
    forbidClientAccountCreation: false,
    passwordResetTokenExpirationInDays: 2
  });
});