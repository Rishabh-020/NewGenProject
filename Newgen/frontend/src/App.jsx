import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import UploadPage    from './features/upload/pages/UploadPage'
import ReviewPage    from './features/review/pages/ReviewPage'
import LoginPage     from './features/auth/pages/LoginPage'
import RegisterPage  from './features/auth/pages/RegisterPage'

import { UploadProvider }    from './features/upload/context/UploadContext'
import { ReviewProvider }    from './features/review/context/ReviewContext'
import { InspectorProvider } from './features/inspector/context/InspectorContext'
import { AuthProvider }      from './features/auth/context/AuthContext'
import { FigmaProvider }     from './features/figma/context/FigmaContext'
import ProtectedRoute        from './shared/components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UploadProvider>
          <ReviewProvider>
            <InspectorProvider>
              <FigmaProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login"    element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected routes */}
                  <Route path="/" element={
                    <ProtectedRoute><UploadPage /></ProtectedRoute>
                  } />
                  <Route path="/review" element={
                    <ProtectedRoute><ReviewPage /></ProtectedRoute>
                  } />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </FigmaProvider>
            </InspectorProvider>
          </ReviewProvider>
        </UploadProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
