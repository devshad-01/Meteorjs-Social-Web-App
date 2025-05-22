import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(async () => {
  // Code to run on server startup
  
  // Configure email verification (optional)
  Accounts.config({
    sendVerificationEmail: false,
    forbidClientAccountCreation: false
  });
  
  // You can add initial admin user if needed
  const userCount = await Meteor.users.find().countAsync();
  if (userCount === 0) {
    console.log('Creating default admin user');
    const userId = Accounts.createUser({
      email: 'admin@example.com',
      password: 'password123'
    });
    
    // Add admin role if you implement roles later
    // Roles.addUsersToRoles(userId, 'admin');
  }
});