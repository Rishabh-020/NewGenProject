import React, { createContext, useContext, useState } from 'react'

const ReviewContext = createContext(null)

export function ReviewProvider({ children }) {
  const [viewMode, setViewMode] = useState('side-by-side') // 'side-by-side' | 'slider'
  const [zoom, setZoom] = useState(100)
  const [sliderPos, setSliderPos] = useState(50) // for slider overlay mode (0-100)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)

  return (
    <ReviewContext.Provider value={{
      viewMode, setViewMode,
      zoom, setZoom,
      sliderPos, setSliderPos,
      isAnalyzing, setIsAnalyzing,
      analysisComplete, setAnalysisComplete
    }}>
      {children}
    </ReviewContext.Provider>
  )
}

export function useReviewContext() {
  const ctx = useContext(ReviewContext)
  if (!ctx) throw new Error('useReviewContext must be used inside ReviewProvider')
  return ctx
}
