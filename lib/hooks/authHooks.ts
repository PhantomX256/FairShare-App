import { useState } from "react";
import { useToast } from "@/components/contexts/ToastContext";
import { useAuth } from "@/components/contexts/AuthContext";
import { useRouter } from "expo-router";
import { logout, signIn, signUp } from "@/lib/firebase/firebase";

/**
 * Custom hook for handling user login.
 */
export const useLogin = () => {
  // Create a loading state
  const [loading, setLoading] = useState(false);

  // Get the showToast function from the ToastContext
  const { showToast } = useToast();

  // Get the setUser and setIsLoggedIn functions from the AuthContext
  const { setUser, setIsLoggedIn } = useAuth();

  // Get the router object from the Expo Router
  const router = useRouter();

  // Create a function to handle user login
  const handleLogin = async (email: string, password: string) => {
    try {
      // Set the loading state to true
      setLoading(true);

      // Sign in the user with the provided email and password
      const user = await signIn(email, password);

      // Set the user in the context
      setUser(user);

      // Set the isLoggedIn state to true
      setIsLoggedIn(true);

      // Show a success toast
      showToast("Successfully logged in!", "success");

      // Redirect the user to the home
      router.replace("/home");

      // If any errors are caught
    } catch (error: any) {
      // Show an error toast
      showToast(error.message, "error");
    } finally {
      // Set the loading state to false
      setLoading(false);
    }
  };

  // Return the loading state and the handleLogin function
  return { loading, handleLogin };
};

/**
 * Custom hook for handling user sign-up functionality.
 */
export const useSignUp = () => {
  // Create a loading state
  const [loading, setLoading] = useState(false);

  // Get the showToast function from the ToastContext
  const { showToast } = useToast();

  // Get the setUser and setIsLoggedIn functions from the AuthContext
  const { setUser, setIsLoggedIn } = useAuth();

  // Get the router object from the Expo Router
  const router = useRouter();

  // Create a function to handle user sign-up
  const handleSignUp = async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      // Set the loading state to true
      setLoading(true);

      // Sign up the user with the provided full name, email, password, and confirm password
      const user = await signUp(fullName, email, password, confirmPassword);

      // Set the user in the context
      setUser(user);

      // Set the isLoggedIn state to true
      setIsLoggedIn(true);

      // Show a success toast
      showToast("Successfully signed up!", "success");

      // Redirect the user to the home
      router.replace("/home");

      // If any errors are caught
    } catch (error: any) {
      // Show an error toast
      showToast(error.message, "error");
    } finally {
      // Set the loading state to false
      setLoading(false);
    }
  };

  return { loading, handleSignUp };
};

/**
 * Custom hook to handle user logout functionality.
 */
export const useLogout = () => {
  // Create a loading state
  const [loading, setLoading] = useState(false);

  // Get the showToast function from the ToastContext
  const { showToast } = useToast();

  // Get the setUser and setIsLoggedIn functions from the AuthContext
  const { setUser, setIsLoggedIn } = useAuth();

  // Get the router object from the Expo Router
  const router = useRouter();

  // Create a function to handle user logoutkk
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setUser(null);
      setIsLoggedIn(false);
      showToast("Successfully logged out!", "success");
      router.replace("/login");
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleLogout };
};
