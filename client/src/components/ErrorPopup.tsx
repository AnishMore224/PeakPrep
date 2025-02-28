import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useError } from '../contexts/error.context';

interface ErrorPopupProps {
  autoCloseTime?: number; // Time in ms after which the popup will auto-close
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ autoCloseTime = 5000 }) => {
  const { error, clearError } = useError();

  // Auto-close the error popup after specified time
  useEffect(() => {
    if (error && autoCloseTime > 0) {
      const timer = setTimeout(() => {
        clearError();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [error, clearError, autoCloseTime]);

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg animate-fade-in">
        <div className="flex items-start">
          <div className="flex-grow">
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
          <button 
            onClick={clearError}
            className="ml-4 text-red-500 hover:text-red-700 transition-colors"
            aria-label="Close error message"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;