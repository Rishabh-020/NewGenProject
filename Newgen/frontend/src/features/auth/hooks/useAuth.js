import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'

export function useAuth() {
  const { user, token, loading, login, logout } = useAuthContext()
  const [error,      setError]      = useState('')
  const [submitting, setSubmitting] = useState(false)

  const register = async ({ name, email, password, role }) => {
    setSubmitting(true)
    setError('')
    try {
      const res  = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password, role })
      })
      const data = await res.json()
      if (!data.success) { setError(data.message); return false }
      login(data.data.user, data.data.token)
      return true
    } catch {
      setError('Network error. Please try again.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const loginUser = async ({ email, password }) => {
    setSubmitting(true)
    setError('')
    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!data.success) { setError(data.message); return false }
      login(data.data.user, data.data.token)
      return true
    } catch {
      setError('Network error. Please try again.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return { user, token, loading, error, submitting, register, loginUser, logout }
}
