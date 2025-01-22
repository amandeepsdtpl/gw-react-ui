/// <reference types="vite/client" />

interface Window {
  addToast: (toast: {
    message: string;
    variant?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  }) => void;
}