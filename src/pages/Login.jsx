import React, { useState } from "react";
import { Title, Input, Button } from "../components";
import { signIn } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.png";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const token = await signIn(email, senha);
      login(token);
      navigate("/map");
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">


        <div className="mt-10 mb-24 text-center">

          <img
            src={logo}
            alt="Logo Consultas"
            className="mx-auto w-72 mt-10"
          />
        </div>

       

        <form onSubmit={handleSubmit}>
          <div className="mb-10">

            <Input
              label="Email"
              placeholder="Digite seu email..."
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-10">

            <Input
              label="Senha"
              placeholder="Digite sua senha..."
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && (
            <p className="text-red-500 text-center">{erro}</p>
          )}

          <div className="text-center pt-4">
            <Button
              type="submit"
              className="w-64 text-xl py-3 bg-blue-800 hover:bg-blue-600 text-white transition-all rounded-lg"
            >
              Entrar
            </Button>
          </div>
        </form>

        <div className="text-center pt-8 text-gray-600">
          Ainda não possui conta?{' '}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
