import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { configureEmail } from '/imports/startup/server/email-config';
import '/imports/api/users/methods';
import '/imports/api/posts/posts';
import '/imports/api/messages/messages';

Meteor.startup(async () => {
  // Configure email settings
  configureEmail();

  // Configure account settings
  Accounts.config({
    sendVerificationEmail: false,
    forbidClientAccountCreation: false,
    passwordResetTokenExpirationInDays: 2
  });
  
  // Publish user data
  Meteor.publish('allUsers', function () {
    return Meteor.users.find({}, {
      fields: {
        username: 1,
        emails: 1,
        profile: 1
      }
    });
  });
});