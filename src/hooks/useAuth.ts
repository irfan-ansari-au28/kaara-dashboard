import { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "../config/authConfig";

export function useAuth() {
  const { instance, inProgress, accounts } = useMsal();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (accounts.length > 0) {
      setUser(accounts[0]);
    } else {
      setUser(null);
    }
    setLoading(inProgress === InteractionStatus.None);
  }, [accounts, inProgress]);

  const login = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("login failed", error);
    }
  };

  const logout = async () => {
    try {
      await instance.logoutPopup();
    } catch (error) {
      console.error("logout failed", error);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
  };
}