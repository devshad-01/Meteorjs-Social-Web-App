import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Posts } from '../../api/posts/posts';
import { FiHeart, FiMessageSquare, FiShare2, FiMoreVertical } from 'react-icons/fi';

const PostCard = ({ post, currentUser }) => {
  const [expanded, setExpanded] = useState(false);
  const isLongText = (post && post.text && typeof post.text === 'string') ? post.text.length > 280 : false;
  
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg shadow-md mb-4 transition-all hover:shadow-lg">
      <div className="flex items-center mb-3">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          {post.username ? post.username.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="ml-3 flex-grow">
          <p className="font-semibold text-gray-800">{post.username}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <FiMoreVertical size={18} />
        </button>
      </div>
      
      <div className="mb-3">
        {isLongText && !expanded ? (
          <>
            <p className="text-gray-800">{post.text.substring(0, 280)}...</p>
            <button 
              className="text-blue-600 text-sm font-medium mt-1"
              onClick={() => setExpanded(true)}
            >
              Read more
            </button>
          </>
        ) : (
          <p className="text-gray-800">{post.text}</p>
        )}
        {isLongText && expanded && (
          <button 
            className="text-blue-600 text-sm font-medium mt-1"
            onClick={() => setExpanded(false)}
          >
            Show less
          </button>
        )}
      </div>
      
      <div className="flex justify-between border-t pt-3 text-gray-500">
        <button className="flex items-center hover:text-blue-500 transition">
          <FiHeart size={18} className="mr-1" />
          <span className="text-xs sm:text-sm">Like</span>
        </button>
        <button className="flex items-center hover:text-blue-500 transition">
          <FiMessageSquare size={18} className="mr-1" />
          <span className="text-xs sm:text-sm">Comment</span>
        </button>
        <button className="flex items-center hover:text-blue-500 transition">
          <FiShare2 size={18} className="mr-1" />
          <span className="text-xs sm:text-sm">Share</span>
        </button>
      </div>
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
    <div className="max-w-2xl mx-auto px-3 sm:px-0">
      {user && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 transition-all hover:shadow-lg">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-800 bg-white"
            rows="3"
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={!newPostText.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ) : (
        <>
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              <p className="mb-2 text-lg">No posts yet</p>
              <p className="text-sm">Be the first to share something!</p>
            </div>
          ) : (
            <div className="space-y-4 mb-16 sm:mb-0">
              {posts.map(post => (
                <PostCard key={post._id} post={post} currentUser={user} />
              ))}
            </div>
          )}
        </>
      )}

      {!user && (
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 text-center mt-4 shadow-md">
          <p className="text-blue-800 mb-3 font-medium">Sign in to create your own posts!</p>
          <a href="/login" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Sign in
          </a>
        </div>
      )}
    </div>
  );
};

export default PostsList;
