import { useEffect, useState } from 'react'
import { api } from '../lib_api'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

const COLORS = ['#16a34a', '#dc2626']

export default function Reports(){
  const [items,setItems]=useState([])
  useEffect(()=>{ (async()=> setItems(await api('/finance/transactions')))() },[])

  const byType = {}
  items.forEach(t => {
    byType[t.type] = (byType[t.type]||0) + Number(t.amount)
  })

  const dataPie = Object.entries(byType).map(([k,v])=>({name:k,value:v}))

  const byMonth = {}
  items.forEach(t => {
    const m = t.date.slice(0,7)
    byMonth[m] = byMonth[m]||{month:m,income:0,expense:0}
    byMonth[m][t.type]+=Number(t.amount)
  })
  const dataLine = Object.values(byMonth).sort((a,b)=>a.month.localeCompare(b.month))

  return (
    <div className='space-y-6'>
      <h2 className='text-3xl font-semibold'>Relatórios</h2>
      <div className='grid md:grid-cols-2 gap-6'>
        <div className='card h-80'>
          <div className='font-medium mb-2'>Distribuição Receitas x Despesas</div>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie data={dataPie} dataKey='value' nameKey='name' outerRadius={100} label>
                {dataPie.map((entry,index)=>(
                  <Cell key={`c-${index}`} fill={COLORS[index%COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='card h-80'>
          <div className='font-medium mb-2'>Evolução Mensal</div>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={dataLine}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' /><YAxis /><Tooltip /><Legend />
              <Line type='monotone' dataKey='income' stroke='#16a34a' name='Receitas'/>
              <Line type='monotone' dataKey='expense' stroke='#dc2626' name='Despesas'/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
