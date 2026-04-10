import React from 'react'

export default function SeverityBadge({ severity }) {
  const styles = {
    high:   'bg-red-500/20 text-red-400 border border-red-500/30',
    medium: 'bg-orange-400/20 text-orange-400 border border-orange-400/30',
    low:    'bg-blue-400/20 text-blue-400 border border-blue-400/30',
  }

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${styles[severity]}`}>
      {severity}
    </span>
  )
}
