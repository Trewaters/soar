// pages/dashboard.tsx

import React, { useEffect, useState } from 'react'

function Dashboard() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/user')
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        // console.error('Error fetching users:', error)
        throw new Error(`Error fetching users: ${error}`)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <h1>Dashboard - Protected Page</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard
