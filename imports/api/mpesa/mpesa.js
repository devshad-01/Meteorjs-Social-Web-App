import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
// HTTP is now properly imported since we added the package
import { HTTP } from 'meteor/http';

// Collection to store M-Pesa transactions
export const MpesaTransactions = new Mongo.Collection('mpesaTransactions');

if (Meteor.isServer) {
  // Ensure indexes
  Meteor.startup(async () => {
    try {
      await MpesaTransactions.createIndexAsync({ userId: 1 });
      await MpesaTransactions.createIndexAsync({ transactionId: 1 }, { unique: true });
      console.log('M-Pesa indexes created successfully');
    } catch (error) {
      console.error('Error creating M-Pesa indexes:', error);
    }
  });

  // Publication for user's own transactions
  Meteor.publish('userMpesaTransactions', function() {
    if (!this.userId) {
      return this.ready();
    }
    
    return MpesaTransactions.find({ userId: this.userId });
  });
  
  // Simple M-Pesa simulator function (for testing only)
  // In production, this would make real API calls to M-Pesa
  Meteor.methods({
    'mpesa.simulatePayment'(phoneNumber, amount) {
      check(phoneNumber, String);
      check(amount, Number);
      
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to make a payment');
      }
      
      // Simulate processing time (300-800ms)
      const processingTime = Math.floor(Math.random() * 500) + 300;
      
      // Create a unique transaction ID
      const transactionId = 'MP' + Math.floor(Math.random() * 10000000);
      
      // Record the transaction in our database
      const transaction = {
        userId: this.userId,
        transactionId: transactionId,
        phoneNumber: phoneNumber,
        amount: amount,
        status: 'completed',
        type: 'verification',
        createdAt: new Date()
      };
      
      // Insert transaction record
      MpesaTransactions.insert(transaction);
      
      // Return success with transaction ID
      return {
        success: true,
        message: 'Payment processed successfully',
        transactionId: transactionId
      };
    }
  });
}
