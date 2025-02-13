// context/ToastContext.tsx
import React, { createContext, useState, ReactNode, useContext } from "react";
import Toast from "../shared/Toast";

// Define the possible types of toast notifications
type ToastType = "success" | "error" | "info";

// Define the context type for the Toast component
type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

// Create a new context for the Toast component
export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

// Define the props for the ToastProvider component
type ToastProviderProps = {
  children: ReactNode;
};

/**
 * ToastProvider component that provides toast notification functionality to its children.
 */
export const ToastProvider = ({ children }: ToastProviderProps) => {
  // State to manage the toast notification
  const [toast, setToast] = useState({
    visible: false,
    message: "Sample text",
    type: "success" as ToastType,
  });

  /**
   * Displays a toast notification with the specified message and type.
   * The toast will automatically hide after 3 seconds.
   *
   * @param {string} message - The message to display in the toast.
   * @param {ToastType} [type="success"] - The type of toast to display (e.g., "success", "error").
   */
  const showToast = (message: string, type: ToastType = "success") => {
    // Show the toast with the specified message and type
    setToast({ visible: true, message, type });

    // Hide the toast after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast toast={toast} />
      {children}
    </ToastContext.Provider>
  );
};

/**
 * Custom hook to access the Toast context.
 *
 * This hook provides access to the Toast context, which should be used to display toast notifications.
 * It must be used within a `ToastProvider` component; otherwise, it will throw an error.
 *
 * @returns {ToastContextType} The current context value for the Toast context.
 * @throws {Error} If the hook is used outside of a `ToastProvider`.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
