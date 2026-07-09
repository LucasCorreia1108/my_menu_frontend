import { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import styles from "./auth.module.css";
import AuthServices from "../../services/auth";
import Loading from "../loading/loading";
import { useNavigate } from "react-router-dom";

const getStoredAuth = () => {
  const savedAuth = localStorage.getItem("auth");

  if (!savedAuth) return null;

  try {
    return JSON.parse(savedAuth);
  } catch {
    return null;
  }
};

export default function Auth() {
  const navigate = useNavigate();
  const [formType, setFormType] = useState("login");
  const [formData, setFormData] = useState({});
  const { authLoading, login, signup } = AuthServices();
  const [authData, setAuthData] = useState(() => getStoredAuth());

  useEffect(() => {
    const updateAuthData = () => setAuthData(getStoredAuth());

    updateAuthData();
    window.addEventListener("authChanged", updateAuthData);

    return () => window.removeEventListener("authChanged", updateAuthData);
  }, []);

  useEffect(() => {
    if (authData?.token) {
      navigate("/profile", { replace: true });
    }
  }, [authData, navigate]);
 

  const handleChangeFormType = () => {
    setFormData(null);
    if (formType === "login") {
      setFormType("Signup");
    } else {
      setFormType("login");
    }
  };

  const handleFormDataChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();
    switch (formType) {
      case "login":
        login(formData);
        break;
      case "Signup":
        if (formData.password !== formData.confirmPassword) {
          console.log("As senhas não coincidem.");
          return;
        }
        signup(formData);
        break;
    }
  };

  if (authLoading) {
    return (
      <Loading />
    )
  }


  return (
    <div className={styles.authPageContainer}>
      {formType === "login" && (
         <>
          <h1>Login</h1>
          <button onClick={handleChangeFormType}>
            Você não tem uma conta? Clique aqui.
          </button>
          <form onSubmit={handleSubmitForm}>
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              name="email"
              onChange={handleFormDataChange}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              onChange={handleFormDataChange}
            />
            <button style={{color: "#ffffff"}} type="submit">Entrar</button>
          </form>
         </>
      ) }

        {formType === "Signup" && (
        <>
          <h1>Cadastre-se</h1>
        <button onClick={handleChangeFormType}>Login</button>
        <form onSubmit={handleSubmitForm}>
          <TextField
            label="Nome completo"
            variant="outlined"
            type="fullname"
            name="fullname"
            onChange={handleFormDataChange}
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            onChange={handleFormDataChange}
          />
          <TextField
            label="Senha"
            variant="outlined"
            type="password"
            name="password"
            onChange={handleFormDataChange}
          />
          <TextField
            label="Confirmar senha"
            variant="outlined"
            type="password"
            name="confirmPassword"
            onChange={handleFormDataChange}
          />
          <Button style={{color: "#ffffff"}} type="submit">entrar</Button>
        </form>
        </>
        )}
    </div>
  )
}
