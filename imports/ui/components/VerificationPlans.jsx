import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';

export const VerificationPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const plans = [
    {
      id: 'basic',
      name: 'Basic Verification',
      price: 100,
      features: [
        'Profile Verification Badge',
        'Higher visibility in posts',
        'Access to exclusive features'
      ],
      color: 'blue'
    },
    {
      id: 'premium',
      name: 'Premium Verification',
      price: 250,
      features: [
        'Profile Verification Badge',
        'Higher visibility in posts',
        'Access to exclusive features',
        'Premium support',
        'Early access to new features'
      ],
      color: 'purple'
    }
  ];
  
  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setError('');
    setSuccess('');
  };
  
  const handlePhoneNumberChange = (e) => {
    // Simple validation to ensure only numbers are entered
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(value);
  };
  
  const handlePayment = async () => {
    // Simple validation
    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }
    
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setError('');
    setIsProcessing(true);
    
    try {
      // Find the selected plan price
      const plan = plans.find(p => p.id === selectedPlan);
      if (!plan) {
        throw new Error('Invalid plan selected');
      }
      
      // Call the method to simulate M-Pesa payment
      const mpesaResult = await Meteor.callAsync('mpesa.simulatePayment', phoneNumber, plan.price);
      
      // After successful payment, verify the user
      await Meteor.callAsync('verifyUserWithMpesa', {
        transactionId: mpesaResult.transactionId,
        amount: plan.price,
        plan: plan.id
      });
      
      setSuccess(`Payment processed successfully! Your account has been verified. Transaction ID: ${mpesaResult.transactionId}`);
      setSelectedPlan(null);
      setPhoneNumber('');
      
      // Reload the page after 3 seconds to show the verified badge
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.reason || 'Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Get Verified</h2>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
            <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-start">
            <FiCheck className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`border rounded-lg p-5 cursor-pointer transition-all ${
                selectedPlan === plan.id 
                  ? `border-${plan.color}-500 bg-${plan.color}-50 shadow-md` 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow'
              }`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${plan.color}-100 text-${plan.color}-800`}>
                  KSh {plan.price}
                </div>
              </div>
              
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheck className={`mr-2 mt-0.5 text-${plan.color}-500`} />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6">
                <button
                  className={`w-full px-4 py-2 rounded-lg bg-${plan.color}-600 text-white hover:bg-${plan.color}-700 transition-colors ${
                    selectedPlan === plan.id ? 'ring-2 ring-offset-2 ring-${plan.color}-500' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect(plan.id);
                  }}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {selectedPlan && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Payment</h3>
            <p className="text-gray-600 mb-4">
              Enter your M-Pesa phone number to complete the payment. <br />
              <span className="text-sm">(For demo purposes, any valid phone number will work)</span>
            </p>
            
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="e.g. 254712345678"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
              />
            </div>
            
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing Payment...' : 'Pay with M-Pesa'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
