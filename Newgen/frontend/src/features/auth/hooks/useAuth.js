import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

export function useAuth() {
  const { user, loading, login, logout } = useAuthContext();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const register = async (form) => {
    setSubmitting(true);
    setError("");

    try {
     const res = await fetch("/api/auth/register", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       credentials: "include",
       body: JSON.stringify(form),
     });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return false;
      }

      return true;
    } catch {
      setError("Network error");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const loginUser = async (form) => {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return false;
      }

      login(data.data.user);
      return true;
    } catch {
      setError("Network error");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    user,
    loading,
    error,
    submitting,
    register,
    loginUser,
    logout,
  };
}
