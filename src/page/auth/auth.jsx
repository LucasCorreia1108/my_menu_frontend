import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import styles from "./auth.module.css";
import useAuthServices from "../../services/auth";
import Loading from "../loading/loading";
import { useNavigate } from "react-router-dom";
import * as yup from "yup"; // 1. Importar o Yup
import { getStoredAuth, subscribeToAuthChanges } from "../../utils/authStorage";

// 2. Definir o Schema de Validação para o Cadastro
const signupSchema = yup.object().shape({
  fullname: yup
    .string()
    .required("O nome completo é obrigatório.")
    .min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: yup
    .string()
    .email("Insira um e-mail válido.")
    .required("O e-mail é obrigatório."),
  password: yup
    .string()
    .required("A senha é obrigatória.")
    .min(6, "A senha deve ter pelo menos 6 caracteres."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "As senhas não coincidem.")
    .required("A confirmação de senha é obrigatória."),
});

export default function Auth() {
  const navigate = useNavigate();
  const [formType, setFormType] = useState("login");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({}); // 3. Estado para guardar os erros de validação
  const { authLoading, login, signup } = useAuthServices();
  const [authData, setAuthData] = useState(() => getStoredAuth());

  useEffect(() => {
    const updateAuthData = () => setAuthData(getStoredAuth());

    updateAuthData();
    return subscribeToAuthChanges(updateAuthData);
  }, []);

  useEffect(() => {
    if (authData?.token) {
      navigate("/profile", { replace: true });
    }
  }, [authData, navigate]);

  const handleChangeFormType = () => {
    setFormData({});
    setErrors({}); // Limpa os erros ao mudar de tela
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
    
    if (errors[event.target.name]) {
      setErrors((prev) => ({ ...prev, [event.target.name]: "" }));
    }
  };


  const handleSubmitForm = async (event) => {
    event.preventDefault();
    setErrors({});

    switch (formType) {
      case "login":
        login(formData);
        break;
      case "Signup":
        try {
          await signupSchema.validate(formData, { abortEarly: false });
          signup(formData);
        } catch (validationErrors) {
          const formattedErrors = {};
          validationErrors.inner.forEach((error) => {
            formattedErrors[error.path] = error.message;
          });
          setErrors(formattedErrors);
        }
        break;
    }
  };

  if (authLoading) {
    return <Loading />;
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
            <button style={{ color: "#ffffff" }} type="submit">
              Entrar
            </button>
          </form>
        </>
      )}

      {formType === "Signup" && (
        <>
          <h1>Cadastre-se</h1>
          <button onClick={handleChangeFormType}>Login</button>
          <form onSubmit={handleSubmitForm}>
            <TextField
              label="Nome completo"
              variant="outlined"
              type="text"
              name="fullname"
              onChange={handleFormDataChange}
              error={!!errors.fullname} 
              helperText={errors.fullname}
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              name="email"
              onChange={handleFormDataChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Senha"
              variant="outlined"
              type="password"
              name="password"
              onChange={handleFormDataChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="Confirmar senha"
              variant="outlined"
              type="password"
              name="confirmPassword"
              onChange={handleFormDataChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <button variant="contained" style={{ color: "#ffffff" }} type="submit">
              Cadastrar
            </button>
          </form>
        </>
      )}
    </div>
  );
}