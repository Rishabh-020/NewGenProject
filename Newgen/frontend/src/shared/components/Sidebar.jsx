import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  {
    path: '/',
    title: 'Upload',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )
  },
  {
    path: '/review',
    title: 'Review',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="13" y2="17"/>
      </svg>
    )
  },
  {
    path: null,
    title: 'History',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
      </svg>
    )
  },
  {
    path: null,
    title: 'Team',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    )
  },
  {
    path: null,
    title: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    )
  }
]

export default function Sidebar({ activePath }) {
  const navigate = useNavigate()
  const location = useLocation()
  const active = activePath || location.pathname

  return (
    <aside className="w-14 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col items-center py-3 gap-1 shrink-0">

      {/* Logo */}
      <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-[11px] font-bold text-white font-mono mb-3">
        PC
      </div>

      {/* Nav */}
      {NAV_ITEMS.map((item) => (
        <button
          key={item.title}
          title={item.title}
          onClick={() => item.path && navigate(item.path)}
          className={`
            w-9 h-9 rounded-lg flex items-center justify-center transition-all
            ${active === item.path
              ? 'bg-purple-600/20 text-purple-400'
              : 'text-gray-600 hover:text-gray-400 hover:bg-[#1a1a1a]'
            }
            ${!item.path ? 'cursor-default opacity-40' : 'cursor-pointer'}
          `}
        >
          {item.icon}
        </button>
      ))}

      {/* Bottom help */}
      <div className="mt-auto">
        <button title="Help" className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-700 hover:text-gray-400 hover:bg-[#1a1a1a] transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}
