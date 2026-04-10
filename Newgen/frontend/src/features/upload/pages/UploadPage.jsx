import React from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../../shared/components/Sidebar'
import DropZone from '../components/DropZone'
import { useUpload } from '../hooks/useUpload'

export default function UploadPage() {
  const navigate = useNavigate()
  const { figmaImage, liveImage, handleFigmaUpload, handleLiveUpload, isReady } = useUpload()

  return (
    <div className="flex h-screen bg-[#0d0d0d] overflow-hidden">
      <Sidebar activePath="/" />

      <main className="flex-1 flex flex-col overflow-y-auto">

        {/* Top Bar */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 font-mono">Project X</span>
            <span className="text-gray-700">›</span>
            <span className="text-xs text-gray-400 font-mono">New Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-[11px] font-bold text-white">
              PP
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 max-w-3xl mx-auto w-full">

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Upload Screens to Review
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Upload your Figma reference and the live implementation to begin AI-assisted comparison
            </p>
          </div>

          {/* Upload Grid */}
          <div className="grid grid-cols-2 gap-5 w-full">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">Figma Reference</span>
              </div>
              <DropZone
                label="Drop Figma Export"
                sublabel="Drag & drop or click to browse"
                image={figmaImage}
                onUpload={handleFigmaUpload}
                accentColor="purple"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">Live Implementation</span>
              </div>
              <DropZone
                label="Drop Screenshot"
                sublabel="Drag & drop or click to browse"
                image={liveImage}
                onUpload={handleLiveUpload}
                accentColor="blue"
              />
            </div>
          </div>

          {/* Status row */}
          <div className="flex items-center gap-4 mt-6 w-full">
            <div className="flex-1 h-px bg-[#1e1e1e]" />
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className={figmaImage ? 'text-green-400' : 'text-gray-700'}>
                {figmaImage ? '✓ Figma loaded' : '○ Figma missing'}
              </span>
              <span className="text-gray-800">·</span>
              <span className={liveImage ? 'text-green-400' : 'text-gray-700'}>
                {liveImage ? '✓ Live loaded' : '○ Live missing'}
              </span>
            </div>
            <div className="flex-1 h-px bg-[#1e1e1e]" />
          </div>

          {/* CTA */}
          <button
            disabled={!isReady}
            onClick={() => navigate('/review')}
            className={`
              mt-6 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200
              ${isReady
                ? 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-lg shadow-purple-900/30'
                : 'bg-[#1e1e1e] text-gray-700 cursor-not-allowed'
              }
            `}
          >
            {isReady ? 'Start AI Review →' : 'Upload both screens to continue'}
          </button>

        </div>
      </main>
    </div>
  )
}
