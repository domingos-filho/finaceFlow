import React from 'react'

export default function SummaryCard({ title, value }) {
  return (
    <div className="card">
      <div>{title}</div>
      <div>{value}</div>
    </div>
  )
}