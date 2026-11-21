import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Logo from '../components/Logo'

// Home, login, cadastro e páginas públicas: sem navegação administrativa (RN-23, RN-24).
// `navegacao` mostra os links de entrar/cadastrar; fica fora do formulário e do mural
// para não distrair os convidados.
export default function PublicLayout({ navegacao = false }) {
  const { autenticado } = useAuth()

  return (
    <div className="layout layout-publico">
      <header className="cabecalho cabecalho-simples">
        <div className="cabecalho-conteudo">
          <Logo />
          {navegacao && (
            <>
              <nav aria-label="Seções" className="cabecalho-secoes">
                <a href="/#como-funciona">Como funciona</a>
                <a href="/#mural">O mural</a>
                <a href="/#vantagens">Vantagens</a>
              </nav>
              <nav aria-label="Conta" className="cabecalho-nav">
                {autenticado ? (
                  <NavLink to="/celebracoes" className="botao botao-primario botao-pilula">
                    Minhas celebrações <span aria-hidden="true">→</span>
                  </NavLink>
                ) : (
                  <>
                    <NavLink to="/login">Entrar</NavLink>
                    <Link to="/cadastro" className="botao botao-primario botao-pilula">
                      Criar conta <span aria-hidden="true">→</span>
                    </Link>
                  </>
                )}
              </nav>
            </>
          )}
        </div>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  )
}
