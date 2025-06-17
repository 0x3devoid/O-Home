import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Custom toast configuration
const toastConfig = {
  position: 'bottom-right' as const,
  duration: 10000,
  style: {
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    padding: '12px 16px',
    maxWidth: '350px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    wordWrap: 'break-word' as const,
    wordBreak: 'break-word' as const,
    overflowWrap: 'break-word' as const,
    whiteSpace: 'pre-wrap' as const,
    overflow: 'hidden' as const,
    hyphens: 'auto' as const,
  },
  success: {
    style: {
      background: '#10B981',
      color: '#FFFFFF',
      border: '1px solid #059669',
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#10B981',
    },
  },
  error: {
    style: {
      background: '#EF4444',
      color: '#FFFFFF',
      border: '1px solid #DC2626',
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#EF4444',
    },
  },
  loading: {
    style: {
      background: '#3B82F6',
      color: '#FFFFFF',
      border: '1px solid #2563EB',
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#3B82F6',
    },
  },
};

// Custom success toast function
export const showSuccessToast = (message: string, options = {}) => {
  return toast.success(message, {
    ...toastConfig.success,
    duration: toastConfig.duration,
    ...options,
  });
};

// Custom error toast function
export const showErrorToast = (message: string, options = {}) => {
  return toast.error(message, {
    ...toastConfig.error,
    duration: toastConfig.duration,
    ...options,
  });
};

// Custom loading toast function
export const showLoadingToast = (message: string, options = {}) => {
  return toast.loading(message, {
    ...toastConfig.loading,
    ...options,
  });
};

// Custom info toast function
export const showInfoToast = (message: string, options = {}) => {
  return toast(message, {
    style: {
      ...toastConfig.style,
      background: '#3B82F6',
      color: '#FFFFFF',
      border: '1px solid #2563EB',
     
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#3B82F6',
    },
    duration: toastConfig.duration,
    ...options,
  });
};

export const CustomToaster = () => {
  return (
    <Toaster
      position={toastConfig.position}
      toastOptions={{
        style: toastConfig.style,
        success: toastConfig.success,
        error: toastConfig.error,
        loading: toastConfig.loading,
      }}
      containerStyle={{
        bottom: '20px',
        right: '20px',
      }}
    />
  );
};