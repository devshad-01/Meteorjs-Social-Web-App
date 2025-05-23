import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Posts = new Mongo.Collection('posts');

if (Meteor.isServer) {
  // Publish posts to all clients (no login required)
  Meteor.publish('posts', function() {
    return Posts.find({}, { 
      sort: { createdAt: -1 },
      limit: 20
    });
  });

  // Only allow insertion if user is logged in
  Meteor.methods({
    'posts.insert'(text) {
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to create a post');
      }

      const user = Meteor.users.findOne(this.userId);
      const username = user.username || user.profile?.name || user.emails[0].address;

      Posts.insert({
        text,
        createdAt: new Date(),
        owner: this.userId,
        username: username
      });
    }
  });
}

// Initialize with some data if empty
if (Meteor.isServer) {
  Meteor.startup(async () => {
    // Use countAsync instead of count for server-side code
    const count = await Posts.find().countAsync();
    if (count === 0) {
      const samplePosts = [
        { text: 'Welcome to our social platform!', createdAt: new Date(), username: 'admin' },
        { text: 'This is a sample post. Create an account to add yours!', createdAt: new Date(Date.now() - 1000 * 60 * 60), username: 'admin' },
        { text: 'Check out the new features we just added!', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), username: 'admin' }
      ];
      
      samplePosts.forEach(post => Posts.insert(post));
    }
  });
}