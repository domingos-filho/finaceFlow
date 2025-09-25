import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ff_token')
    const payload = localStorage.getItem('ff_user')
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
      if (payload) setUser(JSON.parse(payload))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('ff_token', data.access_token)
    localStorage.setItem('ff_user', JSON.stringify(data.user || { email }))
    api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`
    setUser(data.user || { email })
  }

  const register = async (name, email, password) => {
    await api.post('/api/auth/register', { name, email, password })
    await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem('ff_token')
    localStorage.removeItem('ff_user')
    delete api.defaults.headers.common.Authorization
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}