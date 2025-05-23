import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
  // Only publish messages to logged in users
  Meteor.publish('messages', function() {
    if (!this.userId) {
      return this.ready();
    }
    
    return Messages.find({
      $or: [
        { senderId: this.userId },
        { receiverId: this.userId }
      ]
    }, { 
      sort: { createdAt: -1 }
    });
  });

  Meteor.methods({
    'messages.send'(receiverId, text) {
      check(receiverId, String);
      check(text, String);
      
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to send a message');
      }
      
      const sender = Meteor.users.findOne(this.userId);
      const receiver = Meteor.users.findOne(receiverId);
      
      if (!receiver) {
        throw new Meteor.Error('user-not-found', 'Recipient user not found');
      }
      
      return Messages.insert({
        text,
        createdAt: new Date(),
        senderId: this.userId,
        senderName: sender.username || sender.profile?.name || sender.emails[0].address,
        receiverId: receiverId,
        receiverName: receiver.username || receiver.profile?.name || receiver.emails[0].address,
        read: false
      });
    }
  });
}