import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, error, submitting, user } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'developer' })

  // if already logged in → skip register, go home
  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user])

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await register(form)
    if (ok) navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-sm font-bold text-white font-mono">
            PC
          </div>
          <span className="text-white font-semibold text-lg">PixelCheck</span>
        </div>

        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-1">Create account</h1>
          <p className="text-sm text-gray-500 mb-7">Start reviewing UI in seconds</p>

          {error && (
            <div className="mb-5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="reviewer">Reviewer</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-wait text-white text-sm font-semibold transition-colors mt-1"
            >
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
