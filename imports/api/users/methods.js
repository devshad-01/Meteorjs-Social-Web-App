import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

Meteor.methods({
  sendVerificationEmail() {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to send verification email');
    }
    
    const user = Meteor.user();
    if (!user.emails || !user.emails[0] || user.emails[0].verified) {
      throw new Meteor.Error('already-verified', 'Email is already verified');
    }
    
    Accounts.sendVerificationEmail(Meteor.userId());
  },
  
  updateUserProfile({ name, bio }) {
    check(name, String);
    check(bio, String);
    
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to update profile');
    }
    
    Meteor.users.update(Meteor.userId(), {
      $set: {
        'profile.name': name,
        'profile.bio': bio,
        'profile.updatedAt': new Date()
      }
    });
  }
});
