import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Logo from '../components/Logo'
import { IconeSair } from '../components/Icones'

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
