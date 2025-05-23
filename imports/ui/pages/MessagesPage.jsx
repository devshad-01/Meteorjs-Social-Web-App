import React from 'react';
import MessagesList from '../components/MessagesList';
import HeaderLayout from '../components/HeaderLayout';

const MessagesPage = () => {
  return (
    <HeaderLayout>
      <MessagesList />
    </HeaderLayout>
  );
};

export default MessagesPage;
