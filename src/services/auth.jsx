import { useState } from "react";
import { getApiUrl } from "../utils/api";
import { clearStoredAuth, saveStoredAuth } from "../utils/authStorage";

export default function useAuthServices() {
    const [authLoading, setAuthLoading] = useState(false);

    const login = (formData) => {
        setAuthLoading(true);
        fetch(getApiUrl("/auth/login"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then((result) => {
             if (result.success && result.body.token) {
                saveStoredAuth({token: result.body.token, user: result.body.user});
                window.dispatchEvent(new Event("authChanged"));
            }
        }).catch((error) => {
            console.error("Error:", error);
        }).finally(() => {
            setAuthLoading(false);
        })
    }

    const logout = async () => {
        clearStoredAuth();
        window.dispatchEvent(new Event("authChanged"));
    }

    const signup = async (formData) => {
        setAuthLoading(true);
        const signupData = { ...formData };
        delete signupData.confirmPassword;

         fetch(getApiUrl("/auth/signup"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupData),
        })
        .then((response) => response.json())
        .then((result) => {
            if (result.success && result.body.token) {
                saveStoredAuth({token: result.body.token, user: result.body.user});
                window.dispatchEvent(new Event("authChanged"));
            }
        }).catch((error) => {
            console.error("Error:", error);
        }).finally(() => {
            setAuthLoading(false);
        })
    }


    return {
        authLoading,
        login,
        logout,
        signup,

    }
}