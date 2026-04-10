import React, { useState } from 'react'
import SeverityBadge from './SeverityBadge'

export default function IssueCard({ issue, isSelected, onSelect }) {
  const [copied, setCopied] = useState(false)

  const copyFix = () => {
    navigator.clipboard.writeText(issue.cssfix)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const isFromFigma = issue.source === 'figma_token'

  return (
    <div
      onClick={onSelect}
      className={`
        rounded-lg border p-3 cursor-pointer transition-all mb-2
        ${isSelected
          ? 'border-[#3a3a3a] bg-[#1e1e1e]'
          : 'border-[#1e1e1e] bg-[#141414] hover:border-[#2a2a2a] hover:bg-[#1a1a1a]'
        }
      `}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {/* Source badge */}
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
            isFromFigma
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
              : 'bg-purple-500/20 text-purple-400 border border-purple-500/20'
          }`}>
            {isFromFigma ? '</>' : '📷'}
          </span>
          <span className="text-xs font-medium text-gray-200">{issue.label}</span>
        </div>
        <SeverityBadge severity={issue.severity} />
      </div>

      {/* Expected vs Actual */}
      <div className="flex items-center gap-2 text-[11px] mb-2">
        <span className="text-green-400 font-mono">{issue.expected}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
        <span className="text-red-400 font-mono">{issue.actual}</span>
      </div>

      {/* CSS Fix */}
      {issue.cssfix && (
        <div className="flex items-center justify-between bg-[#0d0d0d] rounded px-2 py-1.5">
          <code className="text-[11px] text-gray-400 font-mono">{issue.cssfix}</code>
          <button
            onClick={(e) => { e.stopPropagation(); copyFix() }}
            className="text-gray-600 hover:text-gray-300 transition-colors ml-2"
          >
            {copied ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
