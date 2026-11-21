import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Varal from '../components/Varal'
import { Bilhete, Polaroid } from '../components/Polaroid'
import { Baloes, Bolo, Confete, Coracoes, PorDoSol, Presente } from '../components/Ilustracoes'

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

// Fotos do varal decorativo do topo
const VARAL = [
  { foto: <Baloes />, legenda: 'Parabéns, Ana!', rotacao: -4, largura: 168 },
  { foto: <Bolo />, legenda: 'Faz um pedido!', rotacao: 3, largura: 182 },
  { foto: <Coracoes />, legenda: 'Te amo, amiga', rotacao: -2, largura: 160 },
  { foto: <Presente />, legenda: 'Pra você ♥', rotacao: 4, largura: 176 },
  { foto: <PorDoSol />, legenda: 'Aquela viagem…', rotacao: -3, largura: 166 },
  { foto: <Confete />, legenda: 'Bora comemorar!', rotacao: 2, largura: 174 },
]

// Homenagens fictícias, só para ilustrar o mural
const EXEMPLOS = [
  { tipo: 'foto', foto: <Bolo />, legenda: 'Feliz aniversário! Que esse ano seja incrível 🎉', prendedor: 'fita', cor: '#f58a9b', rot: -3, dx: 0, largura: '100%' },
  { tipo: 'bilhete', texto: 'Obrigada por todas as risadas e cafés. Te amo, amiga!', assinatura: 'Júlia', papel: 'amarelo', prendedor: 'alfinete', cor: '#e34155', rot: 2.5, dx: 10, largura: '88%' },
  { tipo: 'foto', foto: <PorDoSol />, legenda: 'Lembra dessa viagem? Bora repetir!', prendedor: 'clipe', cor: '#0277ba', rot: 3, dx: -6, largura: '94%' },
  { tipo: 'bilhete', texto: 'Parabéns, filha! Muito orgulho de você.', assinatura: 'Mãe', papel: 'rosa', prendedor: 'fita', cor: '#ffa300', rot: -2, dx: -4, largura: '86%' },
  { tipo: 'foto', foto: <Baloes />, legenda: 'Com carinho, equipe de design', prendedor: 'alfinete', cor: '#ffa300', rot: -1.5, dx: 8, largura: '92%' },
  { tipo: 'foto', foto: <Coracoes />, legenda: 'Muitos anos de vida!', prendedor: 'fita', cor: '#0277ba', rot: 2, dx: 0, largura: '84%' },
]

const DESTAQUES = [
  { titulo: 'Sem cadastro para convidados', texto: 'Quem recebe o link só escreve, escolhe uma foto e envia.', cor: 'azul' },
  { titulo: 'Aparece na hora', texto: 'Cada homenagem vai direto para o mural, sem esperar aprovação.', cor: 'laranja' },
  { titulo: 'Você no controle', texto: 'Acompanhe o que chegou e remova o que não fizer sentido.', cor: 'rosa' },
]

export default function Home() {
  const { autenticado } = useAuth()

  return (
    <div className="home">
      <Varal fotos={VARAL} />

      <section className="home-hero">
        <p className="sobretitulo">Homenagens de aniversário</p>
        <h1>
          Todas as homenagens <span className="destaque-escrito">em um só lugar</span>
        </h1>
        <p className="home-subtitulo">
          Com o Celebrarte, você junta fotos e mensagens de amigos, família e colegas em um mural
          para o aniversariante, sem ficar caçando conversas e grupos.
        </p>
        <div className="acoes acoes-centro">
          {autenticado ? (
            <Link to="/celebracoes" className="botao botao-primario botao-grande">Ir para minhas celebrações</Link>
          ) : (
            <>
              <Link to="/cadastro" className="botao botao-primario botao-grande">
                Criar uma celebração <span aria-hidden="true">→</span>
              </Link>
              <Link to="/login" className="botao botao-fantasma botao-grande">Já tenho conta</Link>
            </>
          )}
        </div>
      </section>

      <section id="como-funciona" className="home-secao" aria-labelledby="como-funciona-titulo">
        <h2 id="como-funciona-titulo">Como funciona</h2>
        <ol className="home-passos">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="home-passo">
              <span className="prendedor prendedor-fita" aria-hidden="true" />
              <span className="home-passo-numero" aria-hidden="true">{i + 1}</span>
              <h3>{p.titulo}</h3>
              <p className="texto-suave">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="mural" className="home-secao home-mural" aria-labelledby="mural-titulo">
        <h2 id="mural-titulo">Um mural feito de memórias</h2>
        <p className="home-secao-subtitulo texto-suave">
          Nada de lista de mensagens: cada homenagem vira uma foto presa no painel, do jeitinho que a gente faz com as fotos de verdade.
        </p>
        <div className="home-mural-painel" aria-hidden="true">
          <p className="home-mural-painel-titulo">Feliz aniversário, Ana!</p>
          <ul className="painel">
            {EXEMPLOS.map((e) => (
              <li key={e.legenda ?? e.texto} className="painel-item" style={{ '--rot': `${e.rot}deg`, '--dx': `${e.dx}px`, '--largura': e.largura }}>
                {e.tipo === 'foto' ? (
                  <Polaroid foto={e.foto} legenda={e.legenda} prendedor={e.prendedor} cor={e.cor} />
                ) : (
                  <Bilhete texto={e.texto} assinatura={e.assinatura} papel={e.papel} prendedor={e.prendedor} cor={e.cor} />
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="vantagens" className="home-secao" aria-labelledby="vantagens-titulo">
        <h2 id="vantagens-titulo">Por que usar o Celebrarte</h2>
        <div className="home-destaques">
          {DESTAQUES.map((d) => (
            <div key={d.titulo} className={`home-destaque home-destaque-${d.cor}`}>
              <h3>{d.titulo}</h3>
              <p className="texto-suave">{d.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {!autenticado && (
        <section className="home-cta texto-centro">
          <h2>Tem um aniversário chegando?</h2>
          <p>Crie sua conta grátis e comece a juntar as homenagens hoje.</p>
          <Link to="/cadastro" className="botao botao-claro botao-grande">
            Começar agora <span aria-hidden="true">→</span>
          </Link>
        </section>
      )}
    </div>
  )
}
