import React from 'react'
import { useUploadContext } from '../../upload/context/UploadContext'
import { useInspectorContext } from '../../inspector/context/InspectorContext'

export default function SideBySide() {
  const { figmaImage, liveImage } = useUploadContext()
  const { issues, selectedIssue, setSelectedIssue } = useInspectorContext()

  const highCount = issues.filter(i => i.severity === 'high').length

  return (
    <div className="flex gap-4 h-full">

      {/* Figma Panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-gray-500 border border-[#2a2a2a] px-2 py-0.5 rounded">
            Figma Reference
          </span>
        </div>
        <div className="flex-1 bg-[#141414] rounded-xl border border-[#1e1e1e] overflow-hidden flex items-center justify-center p-4">
          {figmaImage
            ? <img src={figmaImage.url} alt="Figma" className="max-w-full max-h-full object-contain rounded-lg" />
            : <span className="text-gray-700 text-sm">No image</span>
          }
        </div>
      </div>

      {/* Live Panel with annotations */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-gray-500 border border-[#2a2a2a] px-2 py-0.5 rounded">
            Live Implementation
          </span>
          {highCount > 0 && (
            <span className="text-[11px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
              {issues.length} Issues
            </span>
          )}
        </div>
        <div className="flex-1 bg-[#141414] rounded-xl border border-[#1e1e1e] overflow-hidden relative flex items-center justify-center p-4">
          {liveImage ? (
            <div className="relative">
              <img src={liveImage.url} alt="Live" className="max-w-full max-h-full object-contain rounded-lg" />

              {/* Annotation overlays */}
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue.id === selectedIssue ? null : issue.id)}
                  className={`
                    absolute border-2 rounded cursor-pointer transition-all
                    ${issue.severity === 'high'   ? 'border-red-500 bg-red-500/10 annotation-high' : ''}
                    ${issue.severity === 'medium' ? 'border-orange-400 bg-orange-400/10' : ''}
                    ${issue.severity === 'low'    ? 'border-blue-400 bg-blue-400/10' : ''}
                    ${selectedIssue === issue.id  ? 'ring-2 ring-white/20' : ''}
                  `}
                  style={{
                    left:   `${issue.bbox?.x ?? 10}%`,
                    top:    `${issue.bbox?.y ?? 10}%`,
                    width:  `${issue.bbox?.w ?? 30}%`,
                    height: `${issue.bbox?.h ?? 10}%`,
                  }}
                >
                  <span className={`
                    absolute -top-5 left-0 text-[10px] px-1.5 py-0.5 rounded font-mono whitespace-nowrap
                    ${issue.severity === 'high'   ? 'bg-red-500 text-white' : ''}
                    ${issue.severity === 'medium' ? 'bg-orange-400 text-black' : ''}
                    ${issue.severity === 'low'    ? 'bg-blue-400 text-black' : ''}
                  `}>
                    {issue.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-700 text-sm">No image</span>
          )}
        </div>
      </div>

    </div>
  )
}
