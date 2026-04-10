import React, { useRef, useState } from 'react'

export default function DropZone({ label, sublabel, image, onUpload, accentColor = 'purple' }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const accent = {
    purple: 'border-purple-500 bg-purple-500/10',
    blue:   'border-blue-500 bg-blue-500/10',
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) onUpload(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) onUpload(file)
  }

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center
        w-full h-64 rounded-xl border-2 border-dashed cursor-pointer
        transition-all duration-200 overflow-hidden
        ${dragging ? accent[accentColor] : 'border-[#333] bg-[#1a1a1a] hover:border-[#555] hover:bg-[#222]'}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {image ? (
        <>
          <img src={image.url} alt={image.name} className="w-full h-full object-contain p-2" />
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-3 py-1.5 text-xs text-gray-400 truncate">
            {image.name}
          </div>
          <div className="absolute top-2 right-2 bg-green-500/20 border border-green-500/40 text-green-400 text-[10px] px-2 py-0.5 rounded-full">
            ✓ Loaded
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <div className="w-12 h-12 rounded-xl bg-[#252525] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-300">{label}</p>
            <p className="text-xs text-gray-600 mt-1">{sublabel}</p>
          </div>
          <p className="text-[11px] text-gray-700">PNG, JPG up to 10MB</p>
        </div>
      )}
    </div>
  )
}
