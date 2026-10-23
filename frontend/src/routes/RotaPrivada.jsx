import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// RN-02: área administrativa só para usuários autenticados
export default function RotaPrivada() {
  const { autenticado } = useAuth()
  const location = useLocation()

  if (!autenticado) return <Navigate to="/login" replace state={{ de: location.pathname }} />
  return <Outlet />
}
