import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import { jwtDecode } from 'jwt-decode'

export interface AuthContextType {
  user: any
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string>('')
  const router = useNavigationWithLoading()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token) as { userId: string }
      axios.get(`/api/user/${decoded.userId}`).then((res) => {
        setUser(res.data)
      })
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser('')
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
