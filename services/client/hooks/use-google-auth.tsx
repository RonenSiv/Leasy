import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

export function useGoogleAuth() {
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(
    null,
  );

  // Hook from @react-oauth/google
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // 1. Send token to your backend
        const res = await fetch("http://localhost:8000/api/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: tokenResponse.access_token }),
        });

        // 2. Parse the server response. Suppose it returns { full_name, email }.
        const responseData = await res.json();

        // 3. Store that data in state
        setUser({
          full_name: responseData.full_name,
          email: responseData.email,
        });
      } catch (error) {
        console.error("Error during Google auth flow:", error);
      }
    },
    onError: (err) => {
      console.error("Google Login Failed", err);
    },
    scope: "profile email",
  });

  return { loginWithGoogle, user };
}
