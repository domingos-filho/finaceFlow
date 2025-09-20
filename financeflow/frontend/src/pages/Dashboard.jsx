import { useEffect, useState } from 'react'
import { api } from '../lib_api'

export default function Dashboard(){
  const [stats,setStats] = useState({income:0,expense:0, balance:0, budget:0})
  const [recent,setRecent] = useState([])

  useEffect(()=>{
    async function load(){
      const tx = await api('/finance/transactions')
      let income=0, expense=0
      tx.forEach(t => t.type==='income'? income+=Number(t.amount): expense+=Number(t.amount))
      const budgets = await api('/finance/budgets')
      const curMonth = new Date().toISOString().slice(0,7)
      const b = budgets.find(x=>x.month===curMonth)?.amount || 0
      setStats({income, expense, balance: income-expense, budget:b})
      setRecent(tx.slice(0,3))
    }
    load()
  },[])

  const budgetPct = stats.budget? Math.min(100,(stats.expense/stats.budget*100)) : 0

  return (
    <div className='space-y-6'>
      <h2 className='text-3xl font-semibold'>Dashboard</h2>
      <div className='grid md:grid-cols-4 gap-4'>
        <Metric title='Receitas' value={`R$ ${stats.income.toFixed(2)}`} />
        <Metric title='Despesas' value={`R$ ${stats.expense.toFixed(2)}`} />
        <Metric title='Saldo' value={`R$ ${stats.balance.toFixed(2)}`} />
        <Metric title='Orçamento' value={stats.budget? `R$ ${stats.budget.toFixed(2)} (${budgetPct.toFixed(1)}%)`:'—'} />
      </div>
    </div>
  )
}

function Metric({title, value}){
  return (
    <div className='card'>
      <div className='text-sm text-gray-500'>{title}</div>
      <div className='text-2xl font-semibold'>{value}</div>
    </div>
  )
}
