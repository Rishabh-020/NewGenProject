import React, { useRef } from 'react'
import { useUploadContext } from '../../upload/context/UploadContext'
import { useReviewContext } from '../context/ReviewContext'

export default function SliderOverlay() {
  const { figmaImage, liveImage } = useUploadContext()
  const { sliderPos, setSliderPos } = useReviewContext()
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setSliderPos(Math.min(100, Math.max(0, x)))
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-xs font-mono text-gray-500 border border-[#2a2a2a] px-2 py-0.5 rounded">Slider Overlay</span>
        <span className="text-xs text-gray-700">Drag to compare</span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 bg-[#141414] rounded-xl border border-[#1e1e1e] overflow-hidden relative cursor-col-resize select-none"
        onMouseMove={handleMouseMove}
      >
        {/* Live image (bottom) */}
        {liveImage && (
          <img src={liveImage.url} alt="Live" className="absolute inset-0 w-full h-full object-contain" />
        )}

        {/* Figma image clipped to left side */}
        {figmaImage && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img src={figmaImage.url} alt="Figma" className="absolute inset-0 w-full h-full object-contain" />
          </div>
        )}

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/80 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
              <path d="M9 18l-6-6 6-6M15 6l6 6-6 6"/>
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 text-[10px] font-mono bg-black/60 text-gray-300 px-2 py-0.5 rounded pointer-events-none">
          FIGMA
        </div>
        <div className="absolute top-3 right-3 text-[10px] font-mono bg-black/60 text-gray-300 px-2 py-0.5 rounded pointer-events-none">
          LIVE
        </div>
      </div>
    </div>
  )
}
