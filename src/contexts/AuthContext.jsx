import React, { createContext, useContext, useState, useEffect } from "react";

// Criação do contexto
const AuthContext = createContext();

// Hook para usar o contexto
export function useAuth() {
  return useContext(AuthContext);
}

// Provider do contexto
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    // Busca token do sessionStorage ao iniciar
    return sessionStorage.getItem("token") || null;
  });

  // CORREÇÃO AQUI: removido o erro de digitação
  const [user, setUser] = useState(null);

  // Função auxiliar para decodificar o JWT (sem bibliotecas externas)
  const decodeToken = (jwtToken) => {
    try {
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Erro ao decodificar token", error);
      return null;
    }
  };

  // Salva no sessionStorage e atualiza o user sempre que token mudar
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
      const decoded = decodeToken(token);
      // Tenta pegar o nome de claims comuns como 'name', 'sub', ou 'nome'
      setUser({
        name: decoded?.name || decoded?.nome || decoded?.sub || "Usuário",
        ...decoded
      });
    } else {
      sessionStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  // Função para login
  function login(newToken) {
    setToken(newToken);
  }

  // Função para logout
  function logout() {
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}