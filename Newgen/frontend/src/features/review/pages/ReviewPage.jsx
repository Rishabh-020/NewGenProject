import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../shared/components/Sidebar";
import ReviewCanvas from "../components/ReviewCanvas";
import IssueInspector from "../../inspector/components/IssueInspector";
import LogoutModal from "../../upload/components/LogoutModal";
import { useReview } from "../hooks/useReview";
import { useUploadContext } from "../../upload/context/UploadContext";
import { useAuth } from "../../auth/hooks/useAuth";

export default function ReviewPage() {
  const navigate = useNavigate();
  const { figmaImage } = useUploadContext();
  const {
    viewMode,
    setViewMode,
    zoom,
    setZoom,
    isAnalyzing,
    analysisComplete,
    runAnalysis,
  } = useReview();
  const { user: authUser, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!figmaImage) {
      navigate("/");
    } else {
      runAnalysis(); // ← auto-run on mount
    }
  }, []);

  return (
    <div className="flex h-screen bg-[#0d0d0d] overflow-hidden">
      <Sidebar activePath="/review" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-[#1e1e1e] shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 font-mono">Project X</span>
            <span className="text-gray-700">›</span>
            <span className="text-xs text-gray-400 font-mono">Home Screen</span>
            <span className="text-gray-700">›</span>
            <span className="text-[11px] bg-[#252525] text-gray-400 border border-[#333] px-2 py-0.5 rounded font-mono">
              V1.2
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View mode toggle */}
            <div className="flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-0.5 gap-0.5">
              <button
                onClick={() => setViewMode("side-by-side")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
                  viewMode === "side-by-side"
                    ? "bg-[#2a2a2a] text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="8" height="18" rx="1" />
                  <rect x="13" y="3" width="8" height="18" rx="1" />
                </svg>
                Side by Side
              </button>
              <button
                onClick={() => setViewMode("slider")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
                  viewMode === "slider"
                    ? "bg-[#2a2a2a] text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="1" />
                  <line x1="12" y1="2" x2="12" y2="22" />
                </svg>
                Slider Overlay
              </button>
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2 py-1.5">
              <button
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="text-gray-500 hover:text-white text-xs w-4 text-center"
              >
                −
              </button>
              <span className="text-xs font-mono text-gray-400 w-10 text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(200, z + 10))}
                className="text-gray-500 hover:text-white text-xs w-4 text-center"
              >
                +
              </button>
            </div>

            {/* Re-scan button */}
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                isAnalyzing
                  ? "bg-purple-700/50 text-purple-300 cursor-wait"
                  : "bg-purple-600 hover:bg-purple-500 text-white"
              }`}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={isAnalyzing ? "animate-spin" : ""}
              >
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              {isAnalyzing
                ? "Analyzing..."
                : analysisComplete
                  ? "Re-scan with AI"
                  : "Run AI Scan"}
            </button>

            {/* User + Logout */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-[11px] font-bold text-white">
                {authUser?.name?.replace(/\s+/g, "").slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs text-gray-400 font-mono tracking-tight">
                {authUser?.name}
              </span>
              <button
                onClick={() => setShowLogout(true)}
                className="text-[11px] text-gray-500 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-2.5 py-1 hover:text-gray-300 hover:border-[#444] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-5 flex flex-col min-w-0 overflow-hidden">
            <ReviewCanvas />
          </div>
          <IssueInspector />
        </div>
      </div>

      {showLogout && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  );
}
