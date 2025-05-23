import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Posts = new Mongo.Collection('posts');

if (Meteor.isServer) {
  // Publish posts to all clients (public feed, limit for performance)
  Meteor.publish('posts', function() {
    return Posts.find({}, {
      sort: { createdAt: -1 },
      limit: 50
    });
  });

  Meteor.methods({
    'posts.insert'(text) {
      check(text, String);
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to create a post');
      }
      const user = Meteor.users.findOne(this.userId);
      const username = user.username || user.profile?.name || (user.emails && user.emails[0]?.address) || 'Anonymous';
      return Posts.insert({
        text,
        createdAt: new Date(),
        owner: this.userId,
        username
      });
    },
    'posts.remove'(postId) {
      check(postId, String);
      const post = Posts.findOne(postId);
      if (!this.userId || !post || post.owner !== this.userId) {
        throw new Meteor.Error('not-authorized', 'You can only remove your own posts');
      }
      return Posts.remove(postId);
    },
    'posts.edit'(postId, newText) {
      check(postId, String);
      check(newText, String);
      const post = Posts.findOne(postId);
      if (!this.userId || !post || post.owner !== this.userId) {
        throw new Meteor.Error('not-authorized', 'You can only edit your own posts');
      }
      return Posts.update(postId, { $set: { text: newText } });
    }
  });

  // Seed database with sample posts if empty
  Meteor.startup(async () => {
    const count = await Posts.find().countAsync();
    if (count === 0) {
      const now = new Date();
      const samplePosts = [
        { text: 'Welcome to our social platform!', createdAt: now, username: 'admin', owner: null },
        { text: 'This is a sample post. Create an account to add yours!', createdAt: new Date(now - 1000 * 60 * 60), username: 'admin', owner: null },
        { text: 'Check out the new features we just added!', createdAt: new Date(now - 1000 * 60 * 60 * 2), username: 'admin', owner: null }
      ];
      samplePosts.forEach(post => Posts.insert(post));
    }
  });

  // Deny all client-side updates to enforce security
  Posts.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
  });
}
