import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <section className="cartao cartao-medio texto-centro">
      <h1>Página não encontrada</h1>
      <p className="texto-suave">O endereço acessado não existe.</p>
      <Link to="/" className="botao botao-secundario">Ir para o início</Link>
    </section>
  )
}
