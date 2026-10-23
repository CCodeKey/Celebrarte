import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Login e cadastro: quem já está logado vai direto para as celebrações
export default function RotaVisitante() {
  const { autenticado } = useAuth()
  return autenticado ? <Navigate to="/celebracoes" replace /> : <Outlet />
}
