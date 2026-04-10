import React, { createContext, useContext, useState } from 'react'

const InspectorContext = createContext(null)

// Mock issues shown before backend is connected
const MOCK_ISSUES = [
  {
    id: 'sp1',
    category: 'Spacing',
    label: 'Header Padding',
    severity: 'high',
    expected: '16px',
    actual: '24px',
    cssfix: 'padding: 16px;',
    bbox: { x: 5, y: 8, w: 88, h: 14 }
  },
  {
    id: 'sp2',
    category: 'Spacing',
    label: 'Button Padding',
    severity: 'high',
    expected: 'padding: 12px 24px',
    actual: 'padding: 16px 28px',
    cssfix: 'padding: 12px 24px;',
    bbox: { x: 5, y: 82, w: 88, h: 10 }
  },
  {
    id: 'ty1',
    category: 'Typography',
    label: 'Title Font Size',
    severity: 'medium',
    expected: '24px',
    actual: '22px',
    cssfix: 'font-size: 24px;',
    bbox: { x: 5, y: 22, w: 70, h: 8 }
  },
  {
    id: 'co1',
    category: 'Color',
    label: 'Button Color',
    severity: 'low',
    expected: '#7C3AED',
    actual: '#6D28D9',
    cssfix: 'background-color: #7C3AED;',
    bbox: { x: 5, y: 55, w: 88, h: 14 }
  }
]

export function InspectorProvider({ children }) {
  const [issues, setIssues] = useState(MOCK_ISSUES)
  const [selectedIssue, setSelectedIssue] = useState(null)

  const highCount   = issues.filter(i => i.severity === 'high').length
  const mediumCount = issues.filter(i => i.severity === 'medium').length
  const lowCount    = issues.filter(i => i.severity === 'low').length

  return (
    <InspectorContext.Provider value={{
      issues, setIssues,
      selectedIssue, setSelectedIssue,
      highCount, mediumCount, lowCount
    }}>
      {children}
    </InspectorContext.Provider>
  )
}

export function useInspectorContext() {
  const ctx = useContext(InspectorContext)
  if (!ctx) throw new Error('useInspectorContext must be used inside InspectorProvider')
  return ctx
}
