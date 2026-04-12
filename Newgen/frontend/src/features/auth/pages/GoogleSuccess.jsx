import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const { fetchMe } = useAuthContext();

  useEffect(() => {
    fetchMe().then(() => {
      navigate("/", { replace: true });
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
