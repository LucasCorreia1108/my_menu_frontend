import { useState } from "react";

export default function authServices() {
    const [authLoading, setAuthLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    
    const url = `${import.meta.env.VITE_API_URL}`;

    const login = (formData) => {
        setAuthLoading(true);
        fetch(`${url}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then((result) => {
             if (result.success && result.body.token) {
                localStorage.setItem("auth", JSON.stringify({token: result.body.token, user: result.body.user}));
                window.dispatchEvent(new Event("authChanged"));
            }
        }).catch((error) => {
            console.error("Error:", error);
        }).finally(() => {
            setAuthLoading(false);
        })
    }

    const logout = async () => {
        localStorage.removeItem("auth");
        window.dispatchEvent(new Event("authChanged"));
    }

    const signup = async (formData) => {
         fetch(`${url}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then((result) => {
            if (result.success && result.body.token) {
                localStorage.setItem("auth", JSON.stringify({token: result.body.token, user: result.body.user}));
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