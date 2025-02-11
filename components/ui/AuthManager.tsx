import { auth } from "@/FirebaseConfig";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

const AuthManager = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/");
      }
    });
    return () => unsubscribe();
  }, []);

  return null;
};

export default AuthManager;
