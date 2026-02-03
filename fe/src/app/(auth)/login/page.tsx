'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await login(email.trim(), password)

    setLoading(false)

    if (!res.success) {
      const msg = res.message || 'Sai tài khoản hoặc mật khẩu'
      setError(msg)
      toast.error(msg)
      console.error('Login failed:', res)
      return
    }

    toast.success('Đăng nhập thành công')
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm bg-white rounded shadow p-6">
        {/* Logo / Title */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold">KẾ TOÁN VẬT TƯ</h1>
          <p className="text-sm text-slate-500">VNPT Yên Bái</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Mật khẩu</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded font-medium transition ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Hint */}
        <div className="mt-4 text-xs text-slate-500">
          <p>Demo tài khoản:</p>
          <p>• ketoan@vnptyb.vn / 123456</p>
          <p>• thukho@vnptyb.vn / 123456</p>
          <p>• quanly@vnptyb.vn / 123456</p>
        </div>
      </div>
    </div>
  )
}
