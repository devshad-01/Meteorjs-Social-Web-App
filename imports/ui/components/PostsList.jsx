import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Posts } from '../../api/posts/posts';

const PostCard = ({ post, currentUser }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center mb-2">
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
          {post.username ? post.username.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="ml-3">
          <p className="font-semibold">{post.username}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      <p className="text-gray-800">{post.text}</p>
    </div>
  );
};

const PostsList = () => {
  const [newPostText, setNewPostText] = useState('');
  const user = useTracker(() => Meteor.user());
  
  const { posts, isLoading } = useTracker(() => {
    const sub = Meteor.subscribe('posts');
    const posts = Posts.find({}, { sort: { createdAt: -1 } }).fetch();
    return {
      posts,
      isLoading: !sub.ready(),
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    
    Meteor.call('posts.insert', newPostText.trim(), (err) => {
      if (err) {
        alert(err.reason || 'Error creating post');
      } else {
        setNewPostText('');
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {user && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Post
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading posts...</div>
      ) : (
        <>
          {posts.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No posts yet</div>
          ) : (
            posts.map(post => (
              <PostCard key={post._id} post={post} currentUser={user} />
            ))
          )}
        </>
      )}

      {!user && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center mt-4">
          <p className="text-blue-800 mb-2">Sign in to create your own posts!</p>
          <a href="/login" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Sign in
          </a>
        </div>
      )}
    </div>
  );
};

export default PostsList;
