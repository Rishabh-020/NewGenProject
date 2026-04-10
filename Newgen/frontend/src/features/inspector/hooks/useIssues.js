import { useInspectorContext } from '../context/InspectorContext'

export function useIssues() {
  const { issues, selectedIssue, setSelectedIssue, highCount, mediumCount, lowCount } = useInspectorContext()

  const groupedIssues = issues.reduce((acc, issue) => {
    if (!acc[issue.category]) acc[issue.category] = []
    acc[issue.category].push(issue)
    return acc
  }, {})

  const selectIssue = (id) => {
    setSelectedIssue(prev => prev === id ? null : id)
  }

  return { issues, groupedIssues, selectedIssue, selectIssue, highCount, mediumCount, lowCount }
}
