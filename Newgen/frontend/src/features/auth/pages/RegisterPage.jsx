// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// export default function RegisterPage() {
//   const navigate = useNavigate();
//   const { register, error, submitting, user } = useAuth();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "developer",
//   });

//   // if already logged in → go home
//   useEffect(() => {
//     if (user) navigate("/", { replace: true });
//   }, [user, navigate]);

//   const handleChange = (e) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const ok = await register(form);
//     if (ok) navigate("/", { replace: true });
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = "http://localhost:5001/api/auth/google";
//   };

//   return (
//     <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
//       <div className="w-full max-w-sm">
//         {/* Logo */}
//         <div className="flex items-center gap-3 mb-10 justify-center">
//           <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-sm font-bold text-white font-mono">
//             PC
//           </div>
//           <span className="text-white font-semibold text-lg">PixelCheck</span>
//         </div>

//         {/* Card */}
//         <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-8">
//           <h1 className="text-xl font-semibold text-white mb-1">
//             Create account
//           </h1>
//           <p className="text-sm text-gray-500 mb-7">
//             Start reviewing UI in seconds
//           </p>

//           {/* Error */}
//           {error && (
//             <div className="mb-5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
//               {error}
//             </div>
//           )}

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//             {/* Name */}
//             <div>
//               <label className="text-xs text-gray-500 mb-1.5 block">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 placeholder="John Doe"
//                 className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="text-xs text-gray-500 mb-1.5 block">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//                 placeholder="you@example.com"
//                 className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="text-xs text-gray-500 mb-1.5 block">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 required
//                 minLength={6}
//                 placeholder="Min. 6 characters"
//                 className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
//               />
//             </div>

//             {/* Role */}
//             <div>
//               <label className="text-xs text-gray-500 mb-1.5 block">Role</label>
//               <select
//                 name="role"
//                 value={form.role}
//                 onChange={handleChange}
//                 className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
//               >
//                 <option value="developer">Developer</option>
//                 <option value="designer">Designer</option>
//                 <option value="reviewer">Reviewer</option>
//               </select>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={submitting}
//               className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-wait text-white text-sm font-semibold transition-colors mt-1"
//             >
//               {submitting ? "Creating account..." : "Create Account"}
//             </button>
//           </form>

//           {/* Divider */}
//           <div className="flex items-center gap-3 my-5">
//             <div className="h-px bg-[#2a2a2a] flex-1"></div>
//             <span className="text-xs text-gray-600">OR</span>
//             <div className="h-px bg-[#2a2a2a] flex-1"></div>
//           </div>

//           {/* Google Login */}
//           <button
//             onClick={handleGoogleLogin}
//             type="button"
//             className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-black text-sm font-semibold transition-colors"
//           >
//             <svg width="18" height="18" viewBox="0 0 48 48">
//               <path
//                 fill="#FFC107"
//                 d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.1 6.1 28.8 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
//               />
//               <path
//                 fill="#FF3D00"
//                 d="M6.3 14.7l6.6 4.8C14.6 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.1 6.1 28.8 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
//               />
//               <path
//                 fill="#4CAF50"
//                 d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.1C29.1 35.8 26.7 37 24 37c-5.2 0-9.6-3.5-11.1-8.3l-6.7 5.2C9.5 39.6 16.2 44 24 44z"
//               />
//               <path
//                 fill="#1976D2"
//                 d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.4-6.2 6.7l6.2 5.1C37.9 37.2 44 31.2 44 24c0-1.3-.1-2.7-.4-3.5z"
//               />
//             </svg>
//             Continue with Google
//           </button>
//         </div>

//         {/* Login link */}
//         <p className="text-center text-xs text-gray-600 mt-5">
//           Already have an account?{" "}
//           <Link to="/login" className="text-purple-400 hover:text-purple-300">
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, error, submitting, user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer",
  });

  // ✅ if already logged in → go home
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = await register(form);

    if (ok) {
      toast.success("Verification email sent 📩");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-sm font-bold text-white font-mono">
            PC
          </div>
          <span className="text-white font-semibold text-lg">PixelCheck</span>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-1">
            Create account
          </h1>
          <p className="text-sm text-gray-500 mb-7">
            Start reviewing UI in seconds
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="reviewer">Reviewer</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-wait text-white text-sm font-semibold transition-colors mt-1"
            >
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Google Login */}
        </div>

        {/* Login link */}
        <p className="text-center text-xs text-gray-600 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:text-purple-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}