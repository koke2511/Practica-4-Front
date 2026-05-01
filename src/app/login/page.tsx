'use client';

import { useState } from "react";
import { login, register } from "@/lib/apis";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

const LoginPage = () => {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState<boolean>(true);

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    try {
      setError("");

      let data;

      if (isLogin) {
        data = await login(email, password);
      } else {
        data = await register(username, email, password);
      }

      const token = data.token || data.access_token || data.accessToken;

      if (!token) {
        setError("No se ha recibido token");
        return;
      }

      setToken(token);
      router.push("/");
    } catch (e) {
      const error = e as AxiosError;

      if (error.response?.status === 404) {
        setError("Endpoint no encontrado.");
      } else if (error.response?.status === 401) {
        setError("Credenciales incorrectas.");
      } else if (error.response?.status === 400) {
        setError("Datos incorrectos. Revisa los campos.");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>{isLogin ? "Iniciar sesión" : "Crear cuenta"}</h1>

        {!isLogin && (
          <input
            className="input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button className="main-button auth-button" onClick={handleSubmit}>
          {isLogin ? "Entrar" : "Registrarme"}
        </button>

        <button
          className="secondary-button auth-button"
          onClick={() => {
            setError("");
            setIsLogin(!isLogin);
          }}
        >
          {isLogin ? "Crear cuenta nueva" : "Ya tengo cuenta"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;