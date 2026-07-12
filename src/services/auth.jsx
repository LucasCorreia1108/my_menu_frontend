import { useState } from "react";

export default function authServices() {
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    const url = `${import.meta.env.VITE_API_URL}`;

    const login = async (formData) => {
        setAuthLoading(true);
        setAuthError(null);
        try {
            const response = await fetch(`${url}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.body.token) {
                localStorage.setItem("auth", JSON.stringify({ token: result.body.token, user: result.body.user }));
                window.dispatchEvent(new Event("authChanged"));
            } else {
                throw new Error(result.message || "Invalid email or password.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setAuthError(error.message || "Login failed. Please try again.");
        } finally {
            setAuthLoading(false);
        }
    }

    const logout = async () => {
        localStorage.removeItem("auth");
        window.dispatchEvent(new Event("authChanged"));
    }

    const signup = async (formData) => {
        setAuthLoading(true);
        setAuthError(null);
        try {
            const response = await fetch(`${url}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.body.token) {
                localStorage.setItem("auth", JSON.stringify({ token: result.body.token, user: result.body.user }));
                window.dispatchEvent(new Event("authChanged"));
            } else {
                throw new Error(result.message || "Could not create your account.");
            }
        } catch (error) {
            console.error("Signup failed:", error);
            setAuthError(error.message || "Signup failed. Please try again.");
        } finally {
            setAuthLoading(false);
        }
    }


    return {
        authLoading,
        authError,
        login,
        logout,
        signup,

    }
}
