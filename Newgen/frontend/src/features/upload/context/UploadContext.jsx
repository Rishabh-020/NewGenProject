import React, { createContext, useContext, useState } from 'react'

const UploadContext = createContext(null)

export function UploadProvider({ children }) {
  const [figmaImage, setFigmaImage] = useState(null)   // { file, url, name }
  const [liveImage, setLiveImage]   = useState(null)   // { file, url, name }
  const [uploadId, setUploadId]     = useState(null)   // set after backend upload

  const reset = () => {
    setFigmaImage(null)
    setLiveImage(null)
    setUploadId(null)
  }

  return (
    <UploadContext.Provider value={{ figmaImage, setFigmaImage, liveImage, setLiveImage, uploadId, setUploadId, reset }}>
      {children}
    </UploadContext.Provider>
  )
}

export function useUploadContext() {
  const ctx = useContext(UploadContext)
  if (!ctx) throw new Error('useUploadContext must be used inside UploadProvider')
  return ctx
}
