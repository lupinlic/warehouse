'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const success = login(username.trim(), password)

    if (!success) {
      setError('Sai tài khoản hoặc mật khẩu')
      return
    }

    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm bg-white rounded shadow p-6">
        {/* Logo / Title */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold">
            KẾ TOÁN VẬT TƯ
          </h1>
          <p className="text-sm text-slate-500">
            VNPT Yên Bái
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Tài khoản</label>
            <input
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition"
          >
            Đăng nhập
          </button>
        </form>

        {/* Hint */}
        <div className="mt-4 text-xs text-slate-500">
          <p>Demo tài khoản:</p>
          <p>• ketoan / 123456</p>
          <p>• thukho / 123456</p>
          <p>• quanly / 123456</p>
        </div>
      </div>
    </div>
  )
}
