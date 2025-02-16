import React from 'react';
import { useNear } from '../context/near-context';

export const LoginModal = ({ isOpen, onClose, onLoginWithProvider }: { isOpen: boolean, onClose: () => void, onLoginWithProvider: (provider: string) => void }) => {
  const { wallet } = useNear();
  
  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h5 className="text-xl font-semibold">Log in</h5>
          <button 
            type="button" 
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-4">
          <button 
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors"
            onClick={() => {
              onLoginWithProvider("google");
              onClose();
            }}
          >
            <i className="bi bi-google"></i>
            <span>Continue with Google</span>
          </button>
          <button 
            className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors"
            onClick={() => {
              onLoginWithProvider("discord");
              onClose();
            }}
          >
            <i className="bi bi-discord"></i>
            <span>Continue with Discord</span>
          </button>
          <button 
            className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors"
            onClick={() => {
              wallet?.signIn();
              onClose();
            }}
          >
            <i className="bi bi-wallet2"></i>
            <span>Log in with Wallet</span>
          </button>
        </div>
        <div className="p-4 border-t flex justify-end">
          <button 
            type="button" 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}; 