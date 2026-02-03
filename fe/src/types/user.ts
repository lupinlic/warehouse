/**
 * User (Người dùng) - Tài khoản người dùng hệ thống
 */
import type { Role } from './role'

export interface User {
  id: string
  username: string
  name: string
  email: string
  phone?: string
  role: Role
  warehouse?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

// Raw response from API
export interface UserApiResponse {
  id: string
  user_name: string
  full_name: string
  email: string
  phone?: string
  roles: Array<{ id?: string; name: string }>
  status?: string
  created_at?: string
  updated_at?: string
  password_hash?: string
  deleted_at?: string
}

export interface UserFormData {
  username: string
  name: string
  email: string
  phone?: string
  role: Role
  password?: string
  status?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  data: {
    user: User
    token?: string
  }
  message?: string
}

export interface UserResponse {
  success: boolean
  data: User
  message?: string
}

export interface UserListResponse {
  success: boolean
  data: User[]
  total?: number
  message?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token?: string
  isLoading: boolean
  error?: string
}
