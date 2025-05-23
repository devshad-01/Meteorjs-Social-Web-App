import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Posts } from '../../api/posts/posts';
import { FiHeart, FiMessageSquare, FiShare2, FiMoreVertical, FiImage, FiX } from 'react-icons/fi';

const PostCard = ({ post, currentUser }) => {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const isLongText = (post && post.text && typeof post.text === 'string') ? post.text.length > 280 : false;
  const isOwner = currentUser && post.owner === currentUser._id;
  const userLiked = currentUser && post.likes && Array.isArray(post.likes) && post.likes.includes(currentUser._id);
  
  const handleDeletePost = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      Meteor.call('posts.remove', post._id, (err) => {
        if (err) {
          console.error('Error deleting post:', err);
          alert(err.reason || 'Error deleting post');
        }
      });
    }
  };
  
  const handleLike = () => {
    if (!currentUser) {
      alert('Please sign in to like posts');
      return;
    }
    
    Meteor.call('posts.like', post._id, (err) => {
      if (err) {
        console.error('Error liking post:', err);
        alert(err.reason || 'Error processing like');
      }
    });
  };
  
  const handleComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    
    Meteor.call('posts.comment', post._id, newComment.trim(), (err) => {
      if (err) {
        console.error('Error adding comment:', err);
        alert(err.reason || 'Error adding comment');
      } else {
        setNewComment('');
      }
    });
  };
  
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
        {isOwner && (
          <div className="relative group">
            <button className="text-gray-400 hover:text-gray-600 p-1">
              <FiMoreVertical size={18} />
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
              <div className="py-1">
                <button 
                  onClick={handleDeletePost}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        )}
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
        
        {post.imageUrl && (
          <div className="mt-3">
            <img 
              src={post.imageUrl} 
              alt="Post image" 
              className="max-w-full rounded-lg max-h-96 object-contain"
              loading="lazy"
            />
          </div>
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
      
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        {post.likeCount > 0 && (
          <div>
            {post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}
          </div>
        )}
        {post.commentCount > 0 && (
          <button 
            onClick={() => setShowComments(!showComments)}
            className="hover:underline"
          >
            {post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}
          </button>
        )}
      </div>
      
      <div className="flex justify-between border-t pt-3 text-gray-500">
        <button 
          className={`flex items-center ${userLiked ? 'text-blue-500' : 'hover:text-blue-500'} transition`}
          onClick={handleLike}
        >
          <FiHeart size={18} className="mr-1" fill={userLiked ? 'currentColor' : 'none'} />
          <span className="text-xs sm:text-sm">{userLiked ? 'Liked' : 'Like'}</span>
        </button>
        <button 
          className="flex items-center hover:text-blue-500 transition"
          onClick={() => setShowComments(!showComments)}
        >
          <FiMessageSquare size={18} className="mr-1" />
          <span className="text-xs sm:text-sm">Comment</span>
        </button>
        <button className="flex items-center hover:text-blue-500 transition">
          <FiShare2 size={18} className="mr-1" />
          <span className="text-xs sm:text-sm">Share</span>
        </button>
      </div>
      
      {showComments && (
        <div className="mt-3 pt-3 border-t">
          {post.comments && post.comments.length > 0 ? (
            <div className="mb-3 space-y-3">
              {post.comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded">
                  <div className="flex items-center mb-1">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {comment.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-2">
                      <span className="font-medium text-sm">{comment.username}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-3">No comments yet. Be the first to comment!</p>
          )}
          
          {currentUser ? (
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-grow p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Post
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-500 italic">Sign in to leave a comment</p>
          )}
        </div>
      )}
    </div>
  );
};

const PostsList = () => {
  const [newPostText, setNewPostText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const user = useTracker(() => Meteor.user());
  
  const { posts, isLoading } = useTracker(() => {
    const sub = Meteor.subscribe('posts');
    const posts = Posts.find({}, { sort: { createdAt: -1 } }).fetch();
    return {
      posts,
      isLoading: !sub.ready(),
    };
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }
    
    // Validate file type
    if (!file.type.match('image.*')) {
      alert('Only image files are allowed.');
      return;
    }
    
    // Create file preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImageData(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = () => {
    setImagePreview(null);
    setImageData(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !imageData) return;
    
    Meteor.call('posts.insert', newPostText.trim(), imageData, (err, result) => {
      if (err) {
        console.error('Error creating post:', err);
        alert(err.reason || 'Error creating post. Please try again.');
      } else {
        console.log('Post created successfully:', result);
        setNewPostText('');
        setImagePreview(null);
        setImageData(null);
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
          
          {imagePreview && (
            <div className="relative mt-3 border rounded p-2">
              <button 
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              >
                <FiX size={16} />
              </button>
              <img src={imagePreview} alt="Preview" className="max-h-60 max-w-full mx-auto rounded" />
            </div>
          )}
          
          <div className="flex justify-between items-center mt-3">
            <label className="flex items-center cursor-pointer text-blue-600 hover:text-blue-700 transition-colors">
              <FiImage size={20} className="mr-1" />
              <span className="text-sm">Add Photo</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            
            <button
              type="submit"
              disabled={!newPostText.trim() && !imageData}
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
