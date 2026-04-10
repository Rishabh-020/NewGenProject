// =============================================================================
// useLiveCSS.js
// =============================================================================
// Reads actual computed CSS from elements on the live page using
// window.getComputedStyle() — this is the browser's real CSS values.
//
// Developer adds data-figma-name="Button" on their HTML elements.
// We read those elements and send their CSS to backend for comparison
// against Figma design tokens.
// =============================================================================

import { useState } from 'react'

export function useLiveCSS() {
  const [cssMap,     setCssMap]     = useState({})
  const [extracting, setExtracting] = useState(false)

  // CSS properties we care about — matches what Figma exports
  const PROPERTIES = [
    'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
    'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing',
    'color', 'backgroundColor',
    'borderRadius', 'borderColor', 'borderWidth',
    'width', 'height',
    'gap', 'display', 'flexDirection', 'alignItems', 'justifyContent',
    'opacity'
  ]

  // Extract CSS from all elements that have data-figma-name attribute
  const extractFromPage = (iframeUrl) => {
    setExtracting(true)

    try {
      // get all elements with data-figma-name on current page
      const elements = document.querySelectorAll('[data-figma-name]')

      if (elements.length === 0) {
        console.warn('No elements with data-figma-name found on page')
        setExtracting(false)
        return {}
      }

      const map = {}

      elements.forEach(el => {
        const name   = el.getAttribute('data-figma-name')
        const styles = window.getComputedStyle(el)

        map[name] = {}
        PROPERTIES.forEach(prop => {
          map[name][prop] = styles[prop]
        })
      })

      setCssMap(map)
      setExtracting(false)
      return map

    } catch (err) {
      console.error('CSS extraction failed:', err)
      setExtracting(false)
      return {}
    }
  }

  // Manual entry — user pastes CSS values if auto-extract not possible
  const setManualCSS = (elementName, cssValues) => {
    setCssMap(prev => ({
      ...prev,
      [elementName]: cssValues
    }))
  }

  // Clear all extracted CSS
  const clearCSS = () => setCssMap({})

  return {
    cssMap,
    extracting,
    extractFromPage,
    setManualCSS,
    clearCSS
  }
}
