import React, { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext();


export function useAuth() {
  return useContext(AuthContext);
}


export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    
    return sessionStorage.getItem("token") || null;
  });

  
  const [user, setUser] = useState(null);

  
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

  
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
      const decoded = decodeToken(token);
     
      setUser({
        name: decoded?.name || decoded?.nome || decoded?.sub || "Usuário",
        ...decoded
      });
    } else {
      sessionStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  
  function login(newToken) {
    setToken(newToken);
  }

  
  function logout() {
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}