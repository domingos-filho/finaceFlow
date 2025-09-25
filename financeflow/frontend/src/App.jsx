import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import './styles.css'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </>
  )
}