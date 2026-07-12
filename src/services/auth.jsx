import { useState } from "react";
import { clearStoredAuth, saveStoredAuth } from "../utils/authStorage";
import { requestJson } from "../utils/api";

export default function useAuthServices() {
  const [authLoading, setAuthLoading] = useState(false);

  const storeAuthenticatedUser = (result) => {
    if (result.success && result.body.token) {
      saveStoredAuth({
        token: result.body.token,
        user: result.body.user,
      });
    }
  };

  const submitAuthForm = (path, formData) => {
    setAuthLoading(true);

    return requestJson(path, {
      method: "POST",
      body: formData,
    })
      .then(storeAuthenticatedUser)
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  };

  const login = (formData) => submitAuthForm("/auth/login", formData);
  const signup = (formData) => submitAuthForm("/auth/signup", formData);
  const logout = () => clearStoredAuth();

  return {
    authLoading,
    login,
    logout,
    signup,
  };
}