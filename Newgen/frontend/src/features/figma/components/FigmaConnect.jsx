import React, { useState } from 'react'
import { useFigma } from '../hooks/useFigma'

export default function FigmaConnect() {
  const {
    figmaFileId, setFigmaFileId,
    figmaNodeId, setFigmaNodeId,
    connected, isReady,
    fetchTokens, tokens
  } = useFigma()

  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-[#1e1e1e] rounded-xl bg-[#0f0f0f] overflow-hidden">

      {/* Header */}
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#141414] transition-colors"
      >
        <div className="flex items-center gap-2">
          {/* Figma logo icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z" fill="#0ACF83"/>
            <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" fill="#A259FF"/>
            <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" fill="#F24E1E"/>
            <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" fill="#FF7262"/>
            <path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z" fill="#1ABCFE"/>
          </svg>
          <span className="text-xs font-medium text-gray-300">Figma Code Comparison</span>
          {connected && (
            <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
              Connected · {tokens.length} tokens
            </span>
          )}
        </div>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#555" strokeWidth="2"
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Expanded form */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#1e1e1e] pt-3 flex flex-col gap-3">

          <p className="text-[11px] text-gray-600 leading-relaxed">
            Enter your Figma File ID and Node ID to enable exact CSS comparison
            alongside image diff.
          </p>

          {/* File ID */}
          <div>
            <label className="text-[11px] text-gray-500 mb-1 block">
              Figma File ID
            </label>
            <input
              type="text"
              value={figmaFileId}
              onChange={e => setFigmaFileId(e.target.value)}
              placeholder="e.g. ABC123xyz"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors font-mono"
            />
            <p className="text-[10px] text-gray-700 mt-1">
              From URL: figma.com/file/<span className="text-purple-500">FILE_ID</span>/...
            </p>
          </div>

          {/* Node ID */}
          <div>
            <label className="text-[11px] text-gray-500 mb-1 block">
              Node ID (Frame/Screen)
            </label>
            <input
              type="text"
              value={figmaNodeId}
              onChange={e => setFigmaNodeId(e.target.value)}
              placeholder="e.g. 10:20"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors font-mono"
            />
            <p className="text-[10px] text-gray-700 mt-1">
              From URL: ?node-id=<span className="text-purple-500">10-20</span> (use 10:20 format)
            </p>
          </div>

          {/* Connect button */}
          <button
            onClick={fetchTokens}
            disabled={!isReady}
            className={`
              w-full py-2 rounded-lg text-xs font-semibold transition-all
              ${isReady
                ? 'bg-purple-600 hover:bg-purple-500 text-white'
                : 'bg-[#1e1e1e] text-gray-700 cursor-not-allowed'
              }
            `}
          >
            {connected ? '✓ Reconnect Figma' : 'Connect Figma File'}
          </button>

          {/* Token count */}
          {connected && tokens.length > 0 && (
            <div className="flex items-center gap-2 text-[11px] text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {tokens.length} design tokens loaded from Figma
            </div>
          )}

        </div>
      )}
    </div>
  )
}
