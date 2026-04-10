import React, { useState } from 'react'
import IssueCard from './IssueCard'
import { useIssues } from '../hooks/useIssues'

export default function IssueInspector() {
  const { groupedIssues, selectedIssue, selectIssue, highCount, mediumCount, lowCount, issues } = useIssues()
  const [collapsed, setCollapsed] = useState({})

  const toggleCategory = (cat) => setCollapsed(p => ({ ...p, [cat]: !p[cat] }))

  return (
    <aside className="w-72 border-l border-[#1e1e1e] bg-[#0f0f0f] flex flex-col shrink-0 overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e1e1e]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-sm font-semibold text-white">Issue Inspector</span>
          <span className="text-xs text-gray-500">{issues.length} issues</span>
        </div>

        {/* Severity pills */}
        <div className="flex items-center gap-1.5">
          {highCount > 0 && (
            <span className="text-[11px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-medium">
              {highCount} High
            </span>
          )}
          {mediumCount > 0 && (
            <span className="text-[11px] bg-orange-400/20 text-orange-400 border border-orange-400/30 px-2 py-0.5 rounded-full font-medium">
              {mediumCount} Medium
            </span>
          )}
          {lowCount > 0 && (
            <span className="text-[11px] bg-blue-400/20 text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded-full font-medium">
              {lowCount} Low
            </span>
          )}
        </div>
      </div>

      {/* Issue list */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {Object.entries(groupedIssues).map(([category, categoryIssues]) => (
          <div key={category} className="mb-3">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center justify-between w-full mb-2 group"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">{category}</span>
                <span className="text-[11px] bg-[#222] text-gray-500 px-1.5 py-0.5 rounded">
                  {categoryIssues.length}
                </span>
              </div>
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"
                className={`transition-transform ${collapsed[category] ? '-rotate-90' : ''}`}
              >
                <polyline points="18 15 12 9 6 15"/>
              </svg>
            </button>

            {!collapsed[category] && categoryIssues.map(issue => (
              <IssueCard
                key={issue.id}
                issue={issue}
                isSelected={selectedIssue === issue.id}
                onSelect={() => selectIssue(issue.id)}
              />
            ))}
          </div>
        ))}

        {issues.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
            <p className="text-xs text-gray-600">Run AI Scan to detect issues</p>
          </div>
        )}
      </div>
    </aside>
  )
}
