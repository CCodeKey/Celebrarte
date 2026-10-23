import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function sair() {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <header className="cabecalho">
        <div className="cabecalho-conteudo">
          <Link to="/celebracoes" className="logo">Celebrarte</Link>
          <nav aria-label="Principal" className="cabecalho-nav">
            <NavLink to="/celebracoes" end>Celebrações</NavLink>
            <NavLink to="/perfil">Perfil</NavLink>
            <button type="button" className="botao-link" onClick={sair}>Sair</button>
          </nav>
        </div>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  )
}
