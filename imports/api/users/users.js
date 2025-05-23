import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

if (Meteor.isServer) {
  // Set up user creation hook to add fields to the user profile
  Accounts.onCreateUser((options, user) => {
    const customizedUser = { ...user };
    
    // Ensure the profile exists
    customizedUser.profile = options.profile || {};
    
    // Add createdAt date to profile
    customizedUser.profile.createdAt = new Date();
    
    // Set isVerified to false by default
    customizedUser.profile.isVerified = false;
    
    // Set default avatar using Gravatar or similar service if email exists
    if (user.emails && user.emails.length > 0) {
      const email = user.emails[0].address;
      const emailHash = email.trim().toLowerCase();
      // Using UI Avatars as a fallback (you could use Gravatar here if preferred)
      customizedUser.profile.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`;
    }
    
    return customizedUser;
  });

  // Publications
  Meteor.publish('userData', function() {
    if (!this.userId) {
      return this.ready();
    }
    
    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: {
          'emails': 1,
          'profile': 1,
          'username': 1,
          'createdAt': 1
        }
      }
    );
  });
  
  // Limited user data for displaying in posts and messages
  Meteor.publish('userDisplayData', function() {
    return Meteor.users.find(
      {},
      {
        fields: {
          'profile.name': 1,
          'profile.avatar': 1,
          'profile.isVerified': 1,
          'username': 1
        }
      }
    );
  });
  
  // Create indexes for user lookups
  Meteor.startup(async () => {
    // Create indexes for efficient queries
    try {
      await Meteor.users.createIndexAsync('username');
      await Meteor.users.createIndexAsync('emails.address');
      console.log('User indexes created successfully');
    } catch (error) {
      console.error('Error creating user indexes:', error);
    }
  });
}