import { getCurrentUser } from "@/lib/firebase";
import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { useToast } from "./ToastContext";

// Define the context type for the Auth component
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
}

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create a new context for the Auth component
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Set a state variable to keep track of the user's login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Set a state variable to keep track of the user's information
  const [user, setUser] = useState<any>(null);

  // Set a state variable to keep track of whether the user's information is being loaded
  const [isLoading, setIsLoading] = useState(true);

  // Use the useToast hook to access the showToast function
  const { showToast } = useToast();

  // Use the useEffect hook to get the current user when the component mounts
  useEffect(() => {
    // Define an async function to get the current user
    const getUser = async () => {
      try {
        const user = await getCurrentUser();

        if (user) {
          setUser(user);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error: any) {
        showToast(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the Auth context.
 *
 * This hook uses the `useContext` hook to access the `AuthContext`.
 * If the context is undefined, it means that the hook is being used outside of the `AuthProvider`,
 * and an error is thrown.
 *
 * @returns The Auth context value.
 * @throws {Error} If the hook is used outside of the `AuthProvider`.
 */
export const useAuth = () => {
  // Use the useContext hook to access the Auth context
  const context = useContext(AuthContext);

  // If the context is undefined it means that the hook is being used outside of the AuthProvider
  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  // Return the context
  return context;
};
