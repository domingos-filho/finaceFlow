import { useEffect, useState } from 'react'
import { api } from '../lib_api'
import * as Icons from 'lucide-react'

const iconOptions = ['Wallet','Home','Utensils','Bus','Heart','GraduationCap','Shirt','Gamepad2']

export default function Categories(){
  const [items,setItems]=useState([])
  const [form,setForm]=useState({name:'', kind:'income', icon:'Wallet'})

  async function load(){ setItems(await api('/finance/categories')) }
  useEffect(()=>{ load() },[])

  async function add(e){
    e.preventDefault()
    await api('/finance/categories',{method:'POST', body: JSON.stringify(form)})
    setForm({name:'', kind:'income', icon:'Wallet'})
    load()
  }

  async function remove(id){
    await api(`/finance/categories/${id}`,{method:'DELETE'})
    load()
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-3xl font-semibold'>Suas Categorias</h2>
      <form onSubmit={add} className='card flex flex-wrap items-end gap-3'>
        <div>
          <div className='text-xs mb-1'>Nome</div>
          <input className='border rounded-lg px-3 py-2' value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        </div>
        <div>
          <div className='text-xs mb-1'>Tipo</div>
          <select className='border rounded-lg px-3 py-2' value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})}>
            <option value='income'>Receita</option>
            <option value='expense'>Despesa</option>
          </select>
        </div>
        <div>
          <div className='text-xs mb-1'>Ícone</div>
          <select className='border rounded-lg px-3 py-2' value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})}>
            {iconOptions.map(ic=><option key={ic} value={ic}>{ic}</option>)}
          </select>
        </div>
        <button className='btn'>Nova Categoria</button>
      </form>

      <div className='grid md:grid-cols-3 gap-4'>
        {['income','expense'].map(kind => (
          <div key={kind} className='space-y-2'>
            <div className='font-semibold flex items-center gap-2'>
              <span className={'badge ' + (kind==='income'?'bg-green-100 text-green-700':'bg-red-100 text-red-700')}>{kind==='income'?'Receitas':'Despesas'}</span>
            </div>
            {items.filter(i=>i.kind===kind).map(i => {
              const Icon = Icons[i.icon] || Icons.Wallet
              return (
                <div key={i.id} className='card flex items-center justify-between'>
                  <div className='flex items-center gap-2'><Icon size={18}/> {i.name}</div>
                  <button className='text-gray-400 hover:text-red-600' onClick={()=>remove(i.id)}>Excluir</button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
