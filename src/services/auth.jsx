import { useState } from "react";
import { useSnackbar } from "../contexts/useSnackbarContext";

export default function authServices() {
    const [authLoading, setAuthLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const { showSuccess, showError } = useSnackbar();

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
                showSuccess("Login realizado com sucesso!");
            } else {
                showError(result.message || "Não foi possível fazer login. Verifique suas credenciais.");
            }
        }).catch((error) => {
            showError("Erro ao realizar login!");
        }).finally(() => {
            setAuthLoading(false);
        })
    }

    const logout = async () => {
        localStorage.removeItem("auth");
        window.dispatchEvent(new Event("authChanged"));
        showSuccess("Você saiu com sucesso!");
    }

    const signup = async (formData) => {
        setAuthLoading(true);
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
                showSuccess("Cadastro realizado com sucesso!");
            }else {
                showError(result.message || "Não foi possível realizar o cadastro. Verifique suas informações.");
            }
        }).catch((error) => {
            showError("Erro ao cadastrar. Tente novamente.");
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