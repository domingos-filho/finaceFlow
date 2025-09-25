import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8000'
})

export default api