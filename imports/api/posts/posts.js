import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { extractHashtags, updateTagsCollection } from './tags';

export const Posts = new Mongo.Collection('posts');

if (Meteor.isServer) {
  // Publish posts to all clients (public feed, limit for performance)
  Meteor.publish('posts', function() {
    return Posts.find({}, {
      sort: { createdAt: -1 },
      limit: 50
    });
  });
  
  // Publish posts by user
  Meteor.publish('userPosts', function(userId) {
    check(userId, String);
    return Posts.find({ owner: userId }, {
      sort: { createdAt: -1 },
      limit: 20
    });
  });
  
  // Publish posts by search term
  Meteor.publish('searchPosts', function(searchTerm) {
    check(searchTerm, String);
    
    if (!searchTerm) {
      return this.ready();
    }
    
    const regex = new RegExp(searchTerm, 'i');
    return Posts.find(
      { 
        $or: [
          { text: regex },
          { username: regex },
          { tags: searchTerm.toLowerCase() }
        ]
      },
      {
        sort: { createdAt: -1 },
        limit: 50
      }
    );
  });

  Meteor.methods({
    async 'posts.insert'(text, imageUrl = null) {
      check(text, String);
      if (imageUrl) check(imageUrl, String);
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to create a post');
      }
      try {
        const user = await Meteor.users.findOneAsync(this.userId);
        if (!user) {
          throw new Meteor.Error('user-not-found', 'User not found');
        }
        const username = user.username || user.profile?.name || (user.emails && user.emails[0]?.address) || 'Anonymous';
        
        // Extract hashtags
        const tags = extractHashtags(text);
        
        // Insert post
        const postId = await Posts.insertAsync({
          text,
          imageUrl,
          createdAt: new Date(),
          owner: this.userId,
          username,
          likes: [],
          likeCount: 0,
          comments: [],
          commentCount: 0,
          tags: tags
        });
        
        // Update tags collection
        if (tags.length > 0) {
          await updateTagsCollection(tags);
        }
        
        return postId;
      } catch (error) {
        console.error('Error in posts.insert method:', error);
        throw new Meteor.Error('internal-error', error.message || 'An error occurred while creating your post');
      }
    },
    async 'posts.remove'(postId) {
      check(postId, String);
      const post = await Posts.findOneAsync(postId);
      if (!this.userId || !post || post.owner !== this.userId) {
        throw new Meteor.Error('not-authorized', 'You can only remove your own posts');
      }
      
      // If post has tags, update the tags collection
      if (post.tags && post.tags.length > 0) {
        await updateTagsCollection(post.tags, false);
      }
      
      return await Posts.removeAsync(postId);
    },
    async 'posts.edit'(postId, newText) {
      check(postId, String);
      check(newText, String);
      const post = await Posts.findOneAsync(postId);
      if (!this.userId || !post || post.owner !== this.userId) {
        throw new Meteor.Error('not-authorized', 'You can only edit your own posts');
      }
      return await Posts.updateAsync(postId, { $set: { text: newText } });
    },
    async 'posts.like'(postId) {
      check(postId, String);
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to like a post');
      }
      
      const post = await Posts.findOneAsync(postId);
      if (!post) {
        throw new Meteor.Error('not-found', 'Post not found');
      }
      
      // Check if user already liked the post
      const likes = post.likes || [];
      const userLiked = likes.includes(this.userId);
      
      if (userLiked) {
        // Unlike the post
        return await Posts.updateAsync(postId, { 
          $pull: { likes: this.userId },
          $inc: { likeCount: -1 }
        });
      } else {
        // Like the post
        return await Posts.updateAsync(postId, { 
          $addToSet: { likes: this.userId },
          $inc: { likeCount: 1 }
        });
      }
    },
    async 'posts.comment'(postId, commentText) {
      check(postId, String);
      check(commentText, String);
      
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to comment');
      }
      
      const post = await Posts.findOneAsync(postId);
      if (!post) {
        throw new Meteor.Error('not-found', 'Post not found');
      }
      
      const user = await Meteor.users.findOneAsync(this.userId);
      const username = user.username || user.profile?.name || (user.emails && user.emails[0]?.address) || 'Anonymous';
      
      const comment = {
        id: new Mongo.ObjectID()._str,
        text: commentText,
        createdAt: new Date(),
        owner: this.userId,
        username
      };
      
      return await Posts.updateAsync(postId, { 
        $push: { comments: comment },
        $inc: { commentCount: 1 }
      });
    }
  });

  // Seed database with sample posts if empty
  Meteor.startup(async () => {
    const count = await Posts.find().countAsync();
    if (count === 0) {
      const now = new Date();
      const samplePosts = [
        { 
          text: 'Welcome to our social platform!', 
          createdAt: now, 
          username: 'admin', 
          owner: null, 
          likes: [], 
          likeCount: 0, 
          comments: [], 
          commentCount: 0 
        },
        { 
          text: 'This is a sample post. Create an account to add yours!', 
          createdAt: new Date(now - 1000 * 60 * 60), 
          username: 'admin', 
          owner: null, 
          likes: [], 
          likeCount: 0, 
          comments: [], 
          commentCount: 0 
        },
        { 
          text: 'Check out the new features we just added!', 
          createdAt: new Date(now - 1000 * 60 * 60 * 2), 
          username: 'admin', 
          owner: null, 
          likes: [], 
          likeCount: 0, 
          comments: [], 
          commentCount: 0 
        }
      ];
      samplePosts.forEach(async post => await Posts.insertAsync(post));
    }
  });

  // Deny all client-side updates to enforce security
  Posts.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
  });
}
