import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Logo from '../components/Logo'

// Porta com seta saindo: ícone convencional de "sair da conta"
function IconeSair() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

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
          <Logo to="/celebracoes" />
          <nav aria-label="Principal" className="cabecalho-nav">
            <NavLink to="/celebracoes" end>Celebrações</NavLink>
            <NavLink to="/perfil">Perfil</NavLink>
            <button type="button" className="botao-sair" onClick={sair} title="Sair da conta">
              <IconeSair />
              <span className="botao-sair-texto">Sair</span>
            </button>
          </nav>
        </div>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  )
}
