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
  },
  
  // For testing purposes - in production this would be connected to payment system
  async toggleAccountVerification() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to request verification');
    }
    
    try {
      const user = await Meteor.users.findOneAsync(this.userId);
      const currentStatus = user.profile?.isVerified || false;
      
      // Toggle verification status
      return await Meteor.users.updateAsync(this.userId, {
        $set: {
          'profile.isVerified': !currentStatus,
          'profile.verificationDate': !currentStatus ? new Date() : null
        }
      });
    } catch (error) {
      console.error('Error toggling verification status:', error);
      throw new Meteor.Error('verification-failed', 'Failed to update verification status');
    }
  },
  
  // Verify user account after M-Pesa payment
  async verifyUserWithMpesa({ transactionId, amount, plan }) {
    check(transactionId, String);
    check(amount, Number);
    check(plan, String);
    
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to request verification');
    }
    
    try {
      // Update user's verification status
      await Meteor.users.updateAsync(this.userId, {
        $set: {
          'profile.isVerified': true,
          'profile.verificationDate': new Date(),
          'profile.verificationTransaction': transactionId,
          'profile.verificationPlan': plan,
          'profile.verificationAmount': amount
        }
      });
      
      return {
        success: true,
        message: 'Your account has been successfully verified!'
      };
    } catch (error) {
      console.error('Error verifying user with M-Pesa:', error);
      throw new Meteor.Error('verification-failed', 'Failed to verify your account. Please try again.');
    }
  }
});
