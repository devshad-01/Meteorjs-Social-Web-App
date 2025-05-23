// filepath: /home/shad/Projects/Meteorjs-Social-Web-App/my-app/imports/ui/components/VerificationBadge.jsx
import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

// A component that displays a verification badge
export const VerificationBadge = ({ isVerified, size = 'md', showLabel = false, className = '' }) => {
  if (!isVerified) return null;
  
  // Size classes for the badge
  const sizeClasses = {
    'sm': 'w-3 h-3',
    'md': 'w-4 h-4',
    'lg': 'w-5 h-5',
  };
  
  const iconSize = sizeClasses[size] || sizeClasses.md;
  
  return (
    <div className={`inline-flex items-center ${className}`}>
      <FiCheckCircle className={`${iconSize} text-blue-500 fill-blue-500 stroke-white`} />
      {showLabel && (
        <span className="ml-1 text-xs font-medium text-blue-600">Verified</span>
      )}
    </div>
  );
};