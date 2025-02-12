"use client";
import React from "react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // This will send user to Laravel's Google route
    window.location.href = "http://localhost:8000/auth/google";
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleGoogleLogin}>Sign In with Google</button>
    </div>
  );
}
