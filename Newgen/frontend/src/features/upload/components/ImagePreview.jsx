import React from 'react'

export default function ImagePreview({ image, label }) {
  if (!image) return null

  return (
    <div className="rounded-lg overflow-hidden border border-[#2a2a2a] bg-[#141414]">
      <div className="px-3 py-2 border-b border-[#2a2a2a] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span className="text-xs text-gray-400 font-mono">{label}</span>
      </div>
      <img src={image.url} alt={label} className="w-full object-contain max-h-48" />
    </div>
  )
}
