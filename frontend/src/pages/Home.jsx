import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const PASSOS = [
  {
    titulo: 'Crie a celebração',
    texto: 'Informe o nome do aniversariante e a data. Em segundos você recebe dois links exclusivos.',
  },
  {
    titulo: 'Compartilhe o link',
    texto: 'Envie o link de contribuição no grupo da família, dos amigos ou do trabalho. Ninguém precisa criar conta.',
  },
  {
    titulo: 'Entregue o mural',
    texto: 'Todas as fotos e mensagens aparecem reunidas em um mural para o aniversariante ver quando quiser.',
  },
]

// Homenagens fictícias, só para ilustrar o mural
const EXEMPLOS = [
  { mensagem: 'Feliz aniversário, Ana! Que esse ano seja tão incrível quanto você. 🎉', autor: 'Equipe de design' },
  { mensagem: 'Obrigada por todas as risadas e cafés. Te amo, amiga!', autor: 'Júlia' },
  { mensagem: 'Parabéns, filha! Muito orgulho de você.', autor: 'Mãe' },
]

export default function Home() {
  const { autenticado } = useAuth()

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-texto">
          <p className="sobretitulo">Homenagens de aniversário</p>
          <h1>Todas as homenagens em um só lugar</h1>
          <p className="home-subtitulo">
            Com o Celebrarte, você junta fotos e mensagens de amigos, família e colegas em um mural
            para o aniversariante, sem ficar caçando conversas e grupos.
          </p>
          <div className="acoes">
            {autenticado ? (
              <Link to="/celebracoes" className="botao botao-primario botao-grande">Ir para minhas celebrações</Link>
            ) : (
              <>
                <Link to="/cadastro" className="botao botao-primario botao-grande">Criar uma celebração</Link>
                <Link to="/login" className="botao botao-fantasma botao-grande">Já tenho conta</Link>
              </>
            )}
          </div>
        </div>

        <div className="home-mural-exemplo" aria-hidden="true">
          <p className="home-mural-exemplo-titulo">Feliz aniversário, Ana!</p>
          {EXEMPLOS.map((e) => (
            <div key={e.autor} className="home-bilhete">
              <p>{e.mensagem}</p>
              <span>{e.autor}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-secao" aria-labelledby="como-funciona">
        <h2 id="como-funciona">Como funciona</h2>
        <ol className="home-passos">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="cartao">
              <span className="home-passo-numero" aria-hidden="true">{i + 1}</span>
              <h3>{p.titulo}</h3>
              <p className="texto-suave">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-secao home-destaques" aria-label="Vantagens">
        <div>
          <h3>Sem cadastro para convidados</h3>
          <p className="texto-suave">Quem recebe o link só escreve, escolhe uma foto e envia.</p>
        </div>
        <div>
          <h3>Aparece na hora</h3>
          <p className="texto-suave">Cada homenagem vai direto para o mural, sem esperar aprovação.</p>
        </div>
        <div>
          <h3>Você no controle</h3>
          <p className="texto-suave">Acompanhe o que chegou e remova o que não fizer sentido.</p>
        </div>
      </section>

      {!autenticado && (
        <section className="home-cta cartao texto-centro">
          <h2>Tem um aniversário chegando?</h2>
          <p className="texto-suave">Crie sua conta grátis e comece a juntar as homenagens hoje.</p>
          <Link to="/cadastro" className="botao botao-primario botao-grande">Começar agora</Link>
        </section>
      )}
    </div>
  )
}
