import { useFigmaContext } from '../context/FigmaContext'
import { useInspectorContext } from '../../inspector/context/InspectorContext'

export function useFigma() {
  const {
    figmaFileId, setFigmaFileId,
    figmaNodeId, setFigmaNodeId,
    tokens,      setTokens,
    cssIssues,   setCssIssues,
    isComparing, setIsComparing,
    connected,   setConnected
  } = useFigmaContext()

  const { setIssues, issues } = useInspectorContext()

  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  // Step 1 — fetch design tokens from Figma API
  const fetchTokens = async () => {
    if (!figmaFileId || !figmaNodeId) return

    try {
      const res  = await fetch('/api/figma/tokens', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          fileId: figmaFileId,
          nodeId: figmaNodeId
        })
      })
      const data = await res.json()
      if (data.success) {
        setTokens(data.data.tokens)
        setConnected(true)
      }
    } catch (err) {
      console.error('Figma token fetch failed:', err)
    }
  }

  // Step 2 — compare Figma tokens with live CSS
  // cssMap comes from useLiveCSS hook
  const compareWithLiveCSS = async (cssMap, reviewId = null) => {
    if (!figmaFileId || !figmaNodeId || !cssMap) return

    setIsComparing(true)

    try {
      const res  = await fetch('/api/figma/full-review', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          fileId:   figmaFileId,
          nodeId:   figmaNodeId,
          liveCSS:  cssMap,
          reviewId: reviewId
        })
      })
      const data = await res.json()

      if (data.success) {
        const newCssIssues = data.data.review?.issues || data.data.issues || []
        setCssIssues(newCssIssues)

        // merge with existing image issues in inspector
        const merged = [
          ...issues.filter(i => i.source !== 'figma_token'),
          ...newCssIssues
        ]
        setIssues(merged)
      }
    } catch (err) {
      console.error('Figma CSS comparison failed:', err)
    } finally {
      setIsComparing(false)
    }
  }

  const isReady = !!(figmaFileId && figmaNodeId)

  return {
    figmaFileId, setFigmaFileId,
    figmaNodeId, setFigmaNodeId,
    tokens,
    cssIssues,
    isComparing,
    connected,
    isReady,
    fetchTokens,
    compareWithLiveCSS
  }
}
