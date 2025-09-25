import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { logout } = useAuth()
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/transactions', label: 'Lançamentos' },
    { to: '/categories', label: 'Categorias' },
  ]

  return (
    <header className="nav">
      <div className="brand">🚀 FinanceFlow</div>
      <nav>
        {links.map(l => (
          <Link key={l.to} to={l.to} className={pathname === l.to ? 'active' : ''}>
            {l.label}
          </Link>
        ))}
      </nav>
      <button onClick={logout}>Sair</button>
    </header>
  )
}