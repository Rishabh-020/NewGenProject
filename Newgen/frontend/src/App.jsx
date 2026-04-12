// import React from "react";
// import { Toaster } from "react-hot-toast";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import GoogleSuccess from "./features/auth/pages/GoogleSuccess";

// import UploadPage from "./features/upload/pages/UploadPage";
// import ReviewPage from "./features/review/pages/ReviewPage";
// import LoginPage from "./features/auth/pages/LoginPage";
// import RegisterPage from "./features/auth/pages/RegisterPage";

// import { UploadProvider } from "./features/upload/context/UploadContext";
// import { ReviewProvider } from "./features/review/context/ReviewContext";
// import { InspectorProvider } from "./features/inspector/context/InspectorContext";
// import { AuthProvider } from "./features/auth/context/AuthContext";
// import { FigmaProvider } from "./features/figma/context/FigmaContext";
// import ProtectedRoute from "./shared/components/ProtectedRoute";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             background: "#1a1a1a",
//             color: "#fff",
//             border: "1px solid #2a2a2a",
//             fontSize: "13px",
//           },
//           success: {
//             iconTheme: {
//               primary: "#a855f7",
//               secondary: "#fff",
//             },
//           },
//         }}
//       />

//       <AuthProvider>
//         <UploadProvider>
//           <ReviewProvider>
//             <InspectorProvider>
//               <FigmaProvider>
//                 <Routes>
//                   {/* Public routes */}
//                   <Route path="/google/success" element={<GoogleSuccess />} />
//                   <Route path="/login" element={<LoginPage />} />
//                   <Route path="/register" element={<RegisterPage />} />

//                   {/* Protected routes */}
//                   <Route
//                     path="/"
//                     element={
//                       <ProtectedRoute>
//                         <UploadPage />
//                       </ProtectedRoute>
//                     }
//                   />
//                   <Route
//                     path="/review"
//                     element={
//                       <ProtectedRoute>
//                         <ReviewPage />
//                       </ProtectedRoute>
//                     }
//                   />

//                   {/* Fallback */}
//                   <Route path="*" element={<Navigate to="/" replace />} />
//                 </Routes>
//               </FigmaProvider>
//             </InspectorProvider>
//           </ReviewProvider>
//         </UploadProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GoogleSuccess from "./features/auth/pages/GoogleSuccess";

import LandingPage from "./features/landing/pages/LandingPage";
import UploadPage from "./features/upload/pages/UploadPage";
import ReviewPage from "./features/review/pages/ReviewPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

import { UploadProvider } from "./features/upload/context/UploadContext";
import { ReviewProvider } from "./features/review/context/ReviewContext";
import { InspectorProvider } from "./features/inspector/context/InspectorContext";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { FigmaProvider } from "./features/figma/context/FigmaContext";
import ProtectedRoute from "./shared/components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid #2a2a2a",
            fontSize: "13px",
          },
          success: {
            iconTheme: {
              primary: "#a855f7",
              secondary: "#fff",
            },
          },
        }}
      />

      <AuthProvider>
        <UploadProvider>
          <ReviewProvider>
            <InspectorProvider>
              <FigmaProvider>
                <Routes>
                  {/* Landing page — default entry for new visitors */}
                  <Route path="/landing" element={<LandingPage />} />

                  {/* Public routes */}
                  <Route path="/google/success" element={<GoogleSuccess />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <UploadPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/review"
                    element={
                      <ProtectedRoute>
                        <ReviewPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback — send everyone to landing */}
                  <Route
                    path="*"
                    element={<Navigate to="/landing" replace />}
                  />
                </Routes>
              </FigmaProvider>
            </InspectorProvider>
          </ReviewProvider>
        </UploadProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}