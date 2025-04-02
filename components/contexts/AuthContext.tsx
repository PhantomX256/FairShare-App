import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { useToast } from "./ToastContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

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

// ... (existing imports and interfaces)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ id: userDoc.id, ...userData });
            setIsLoggedIn(true);
          } else {
            showToast("User document not found.");
            setIsLoggedIn(false);
            setUser(null);
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error: any) {
        showToast(error.message);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Remove or adjust the standalone getCurrentUser function if no longer needed

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
