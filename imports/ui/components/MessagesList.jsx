import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Messages } from '../../api/messages/messages';

const MessagesList = () => {
  const user = useTracker(() => Meteor.user());
  const [message, setMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  
  const { messages, isLoading, otherUsers } = useTracker(() => {
    if (!user) {
      return { messages: [], otherUsers: [], isLoading: false };
    }
    
    const msgSub = Meteor.subscribe('messages');
    const userSub = Meteor.subscribe('allUsers');
    
    // Get all messages for the current user
    const messages = Messages.find({
      $or: [
        { senderId: user._id },
        { receiverId: user._id }
      ]
    }, { sort: { createdAt: -1 } }).fetch();
    
    // Get other users to message
    const otherUsers = Meteor.users.find({ _id: { $ne: user._id } }).fetch();
    
    return {
      messages,
      otherUsers,
      isLoading: !msgSub.ready() || !userSub.ready(),
    };
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !receiverId) return;
    
    Meteor.call('messages.send', receiverId, message, (err) => {
      if (err) {
        alert(err.reason || 'Error sending message');
      } else {
        setMessage('');
      }
    });
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-8">
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">Please Sign In</h3>
          <p className="text-yellow-700 mb-4">You need to be logged in to send and view messages.</p>
          <a 
            href="/login" 
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
        
        <form onSubmit={handleSendMessage}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="receiver">
              Select Recipient
            </label>
            <select
              id="receiver"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a recipient...</option>
              {otherUsers.map(user => (
                <option key={user._id} value={user._id}>
                  {user.username || user.profile?.name || user.emails[0].address}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Messages</h2>
        
        {isLoading ? (
          <div className="text-center py-4">Loading messages...</div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No messages yet</div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div 
                    key={msg._id} 
                    className={`p-3 rounded-lg ${
                      msg.senderId === user._id 
                        ? 'bg-blue-100 ml-8' 
                        : 'bg-gray-100 mr-8'
                    }`}
                  >
                    <p className="text-xs text-gray-500 mb-1">
                      {msg.senderId === user._id ? 'You → ' + msg.receiverName : 'From: ' + msg.senderName}
                    </p>
                    <p>{msg.text}</p>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesList;
