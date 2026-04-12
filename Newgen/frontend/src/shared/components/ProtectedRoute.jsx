// import { useAuthContext } from "../../features/auth/context/AuthContext";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const { user, loading } = useAuthContext();

//   // 🔥 IMPORTANT: wait for auth check
//   if (loading || user === undefined) {
//     return (
//       <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
//         <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!user) return <Navigate to="/login" replace />;

//   return children;
// }

import { useAuthContext } from "../../features/auth/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading || user === undefined) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/landing" replace />;

  return children;
}