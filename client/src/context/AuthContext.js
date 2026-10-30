import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Debug: Log auth state changes
  useEffect(() => {
    console.log("🔄 AUTH STATE CHANGED:", {
      user: user,
      token: token ? "✓ Token exists" : "✗ No token",
      isAuthenticated: Boolean(user),
      loading: loading
    });
  }, [user, token, loading]);

  useEffect(() => {
    if (token) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Fetch logged user
  const getCurrentUser = async () => {
    try {
      console.log("🔄 Getting current user...");
      const response = await authAPI.getMe({
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ GetMe response:", response);

      if (response && response.success) {
        setUser(response.user);
      } else {
        console.log("❌ GetMe failed, logging out");
        logout();
      }
    } catch (error) {
      console.error("❌ GET /me failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      console.log("🔐 Login attempt for:", email);
      const result = await authAPI.login({ email, password });
      const response = result?.data ? result.data : result;
      
      if (response && response.success) {
        localStorage.setItem("token", response.token);
        setToken(response.token);
        setUser(response.user);

        console.log("✅ Login successful! User:", response.user);
        console.log("✅ Token saved:", response.token);

        return { success: true };
      } else {
        return { success: false, error: response?.error || "Invalid credentials" };
      }
    } catch (error) {
      console.log("❌ LOGIN ERROR:", error);
      return { success: false, error: error?.error || error?.message || "Login failed" };
    }
  };

  // Register
  const register = async (data) => {
    try {
      console.log("📝 Registration attempt:", data.email);
      const result = await authAPI.register(data);
      const response = result?.data ? result.data : result;

      if (response && response.success) {
        localStorage.setItem("token", response.token);
        setToken(response.token);
        setUser(response.user); // Set user immediately
        
        console.log("✅ Registration successful! User:", response.user);
        return { success: true };
      } else {
        return { success: false, error: response?.error || "Registration failed" };
      }
    } catch (error) {
      console.log("❌ REGISTRATION ERROR:", error);
      return {
        success: false,
        error: error?.error || error?.message || "Registration failed",
      };
    }
  };

  // Logout
  const logout = () => {
    console.log("👋 Logging out...");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
