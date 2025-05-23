import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

Meteor.methods({
  async sendVerificationEmail() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to send verification email');
    }
    
    const user = await Meteor.users.findOneAsync(this.userId);
    if (!user.emails || !user.emails[0] || user.emails[0].verified) {
      throw new Meteor.Error('already-verified', 'Email is already verified');
    }
    
    try {
      return await Accounts.sendVerificationEmail(this.userId);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Meteor.Error('send-failed', 'Failed to send verification email');
    }
  },
  
  async updateUserProfile({ name, bio, avatar }) {
    check(name, String);
    check(bio, String);
    
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to update profile');
    }
    
    const updateData = {
      'profile.name': name,
      'profile.bio': bio,
      'profile.updatedAt': new Date()
    };
    
    // Only update avatar if it's provided
    if (avatar) {
      check(avatar, String);
      updateData['profile.avatar'] = avatar;
    }
    
    try {
      return await Meteor.users.updateAsync(this.userId, {
        $set: updateData
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Meteor.Error('update-failed', 'Failed to update profile information');
    }
  }
});
