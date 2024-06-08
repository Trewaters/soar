// context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { jwtDecode } from 'jwt-decode'
import { User } from '@prisma/client'

interface AuthContextType {
  user: User
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>({} as User)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token) as { userId: string }
      axios.get(`/api/user/${decoded.userId}`).then((res) => {
        setUser(res.data)
      })
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/login', { email, password })
    const token = response.data.token
    localStorage.setItem('token', token)
    const decoded = jwtDecode(token) as { userId: string }
    const user = await axios.get(`/api/user/${decoded.userId}`)
    setUser(user.data)
    router.push('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser({} as User)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
