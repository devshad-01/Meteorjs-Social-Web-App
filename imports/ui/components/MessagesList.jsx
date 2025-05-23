import React, { useState, useRef, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Messages } from '../../api/messages/messages';
import { FiSend, FiArrowLeft, FiMessageCircle } from 'react-icons/fi';

const MessagesList = () => {
  const user = useTracker(() => Meteor.user());
  const [message, setMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const messagesEndRef = useRef(null);
  
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
    }, { sort: { createdAt: 1 } }).fetch();
    
    // Get other users to message
    const otherUsers = Meteor.users.find({ _id: { $ne: user._id } }).fetch();
    
    return {
      messages,
      otherUsers,
      isLoading: !msgSub.ready() || !userSub.ready(),
    };
  });

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedContact]);

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

  // Get filtered messages between current user and selected contact
  const getFilteredMessages = () => {
    if (!selectedContact) return [];
    
    return messages.filter(msg => 
      (msg.senderId === user._id && msg.receiverId === selectedContact._id) ||
      (msg.senderId === selectedContact._id && msg.receiverId === user._id)
    );
  };

  const filteredMessages = getFilteredMessages();

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setReceiverId(contact._id);
  };

  const getContactName = (user) => {
    return user.username || user.profile?.name || (user.emails && user.emails[0]?.address) || 'User';
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-8 px-4">
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center shadow-md">
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">Please Sign In</h3>
          <p className="text-yellow-700 mb-4">You need to be logged in to send and view messages.</p>
          <a 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 sm:pb-0 px-3 sm:px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {!selectedContact ? (
            <>
              <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">Messages</h2>
              <div className="divide-y">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading contacts...</div>
                ) : otherUsers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No contacts available</div>
                ) : (
                  otherUsers.map(contact => (
                    <div 
                      key={contact._id} 
                      className="p-4 hover:bg-gray-50 cursor-pointer flex items-center"
                      onClick={() => handleSelectContact(contact)}
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                        {getContactName(contact).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{getContactName(contact)}</p>
                        <p className="text-xs text-gray-500">
                          {contact.status || 'Tap to message'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center p-3 bg-blue-50 border-b">
                <button 
                  className="mr-2 p-1 rounded-full hover:bg-blue-100"
                  onClick={() => setSelectedContact(null)}
                >
                  <FiArrowLeft size={20} className="text-blue-600" />
                </button>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-2">
                    {getContactName(selectedContact).charAt(0).toUpperCase()}
                  </div>
                  <p className="font-medium">{getContactName(selectedContact)}</p>
                </div>
              </div>
              
              <div className="flex flex-col h-[calc(100vh-200px)]">
                <div className="flex-grow overflow-y-auto p-4 space-y-3">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation!</p>
                    </div>
                  ) : (
                    filteredMessages.map(msg => (
                      <div 
                        key={msg._id} 
                        className={`p-3 rounded-lg max-w-[70%] ${
                          msg.senderId === user._id 
                            ? 'bg-blue-100 text-blue-900 ml-auto' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
                  <div className="flex">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type a message..."
                    />
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      <FiSend size={20} />
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden md:flex h-[calc(80vh-100px)] min-h-[400px]">
          <div className="w-1/3 border-r overflow-y-auto">
            <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b sticky top-0">Contacts</h2>
            <div className="divide-y">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading contacts...</div>
              ) : otherUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No contacts available</div>
              ) : (
                otherUsers.map(contact => (
                  <div 
                    key={contact._id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center ${
                      selectedContact?._id === contact._id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelectContact(contact)}
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                      {getContactName(contact).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{getContactName(contact)}</p>
                      <p className="text-xs text-gray-500">
                        {contact.status || 'Click to message'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="w-2/3 flex flex-col">
            {selectedContact ? (
              <>
                <div className="p-4 bg-blue-50 border-b flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                    {getContactName(selectedContact).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{getContactName(selectedContact)}</p>
                    <p className="text-xs text-gray-500">
                      {selectedContact.status || 'Online'}
                    </p>
                  </div>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-3">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-lg font-medium mb-1">No messages yet</p>
                      <p className="text-sm">Start the conversation!</p>
                    </div>
                  ) : (
                    filteredMessages.map(msg => (
                      <div 
                        key={msg._id} 
                        className={`p-3 rounded-lg max-w-[70%] ${
                          msg.senderId === user._id 
                            ? 'bg-blue-100 text-blue-900 ml-auto' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                  <div className="flex">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type a message..."
                    />
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                      <FiSend size={16} className="mr-1" /> Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center p-6">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl mx-auto mb-4">
                    <FiMessageCircle size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Messages</h3>
                  <p className="text-gray-600 mb-4">Select a contact to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesList;
