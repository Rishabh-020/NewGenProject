import React, { createContext, useContext, useState } from 'react'

const FigmaContext = createContext(null)

export function FigmaProvider({ children }) {
  const [figmaFileId,  setFigmaFileId]  = useState('')
  const [figmaNodeId,  setFigmaNodeId]  = useState('')
  const [tokens,       setTokens]       = useState([])
  const [cssIssues,    setCssIssues]    = useState([])
  const [isComparing,  setIsComparing]  = useState(false)
  const [connected,    setConnected]    = useState(false)

  const reset = () => {
    setTokens([])
    setCssIssues([])
    setConnected(false)
  }

  return (
    <FigmaContext.Provider value={{
      figmaFileId,  setFigmaFileId,
      figmaNodeId,  setFigmaNodeId,
      tokens,       setTokens,
      cssIssues,    setCssIssues,
      isComparing,  setIsComparing,
      connected,    setConnected,
      reset
    }}>
      {children}
    </FigmaContext.Provider>
  )
}

export function useFigmaContext() {
  const ctx = useContext(FigmaContext)
  if (!ctx) throw new Error('useFigmaContext must be used inside FigmaProvider')
  return ctx
}
