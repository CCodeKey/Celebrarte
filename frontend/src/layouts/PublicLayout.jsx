import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Home, login, cadastro e páginas públicas: sem navegação administrativa (RN-23, RN-24).
// `navegacao` mostra os links de entrar/cadastrar; fica fora do formulário e do mural
// para não distrair os convidados.
export default function PublicLayout({ navegacao = false }) {
  const { autenticado } = useAuth()

  return (
    <div className="layout layout-publico">
      <header className="cabecalho cabecalho-simples">
        <div className="cabecalho-conteudo">
          <Link to="/" className="logo">Celebrarte</Link>
          {navegacao && (
            <nav aria-label="Principal" className="cabecalho-nav">
              {autenticado ? (
                <NavLink to="/celebracoes">Minhas celebrações</NavLink>
              ) : (
                <>
                  <NavLink to="/login">Entrar</NavLink>
                  <Link to="/cadastro" className="botao botao-secundario">Criar conta</Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  )
}
