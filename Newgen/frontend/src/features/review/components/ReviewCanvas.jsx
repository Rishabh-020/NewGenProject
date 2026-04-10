import React from 'react'
import { useReviewContext } from '../context/ReviewContext'
import SideBySide from './SideBySide'
import SliderOverlay from './SliderOverlay'

export default function ReviewCanvas() {
  const { viewMode } = useReviewContext()

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {viewMode === 'side-by-side' ? <SideBySide /> : <SliderOverlay />}
    </div>
  )
}
