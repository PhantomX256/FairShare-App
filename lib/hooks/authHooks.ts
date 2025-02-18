import { useState } from "react";
import { useToast } from "@/components/contexts/ToastContext";
import { useAuth } from "@/components/contexts/AuthContext";
import { useRouter } from "expo-router";
import { signIn, signUp } from "@/lib/firebase";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { setUser, setIsLoggedIn } = useAuth();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const user = await signIn(email, password);
      setUser(user);
      setIsLoggedIn(true);
      router.replace("/home");
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleLogin };
};

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { setUser, setIsLoggedIn } = useAuth();
  const router = useRouter();

  const handleSignUp = async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      setLoading(true);
      const user = await signUp(fullName, email, password, confirmPassword);
      setUser(user);
      setIsLoggedIn(true);
      router.replace("/home");
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSignUp };
};
