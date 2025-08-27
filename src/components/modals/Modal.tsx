import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl'
};

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out" 
        onClick={onClose} 
      />
      
      {/* Container do modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full transform overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 ease-in-out scale-100 opacity-100 ${sizeClasses[size]}`}>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {showCloseButton && (
                <button 
                  onClick={onClose} 
                  className="rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Conteúdo do modal */}
          <div className="px-6 py-6 bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}








