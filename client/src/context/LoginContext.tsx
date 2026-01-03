import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getStoredCredentials,
  getLoginStatus,
  setLoginStatus,
} from "@/services/localService";

interface LoginContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => { message?: string } | void;
  logout: () => void;
}

const LoginContext = createContext<LoginContextType | null>(null);

const LoginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(getLoginStatus());
  }, []);

  const login = (username: string, password: string) => {
    const creds = getStoredCredentials();

    if (creds.username !== username) {
      return { message: "Invalid username" };
    }

    if (creds.password !== password) {
      return { message: "Invalid password" };
    }

    setLoginStatus(true);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setLoginStatus(false);
    setIsLoggedIn(false);
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

const useLogin = () => {
  const ctx = useContext(LoginContext);
  if (!ctx) {
    throw new Error("useLogin must be used inside LoginProvider");
  }
  return ctx;
};

export { LoginProvider, useLogin };
