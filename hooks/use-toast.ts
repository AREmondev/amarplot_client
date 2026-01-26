"use client";

import { toast as toastify, ToastOptions } from "react-toastify";

interface ToastProps {
  title?: string;
  description: string;
  variant?: "default" | "destructive";
}

const useToast = () => {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    const options: ToastOptions = {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    switch (variant) {
      case "destructive":
        toastify.error(description, options);
        break;
      default:
        toastify.success(description, options);
        break;
    }
  };

  return { toast };
};

// Simple toast function for use outside of React components
export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  const options: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  switch (variant) {
    case "destructive":
      toastify.error(description, options);
      break;
    default:
      toastify.success(description, options);
      break;
  }
};

export { useToast };
