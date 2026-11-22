import Alerta from './Alerta'

// Falha ao abrir uma página pelo link público (contribuição ou mural).
// 404 costuma ser link copiado errado: troca a mensagem técnica por uma orientação.
export default function ErroLinkPublico({ titulo, erro, mensagemNaoEncontrado }) {
  return (
    <section className="cartao cartao-medio">
      <h1>{titulo}</h1>
      <Alerta tipo="erro">{erro.status === 404 ? mensagemNaoEncontrado : erro.message}</Alerta>
    </section>
  )
}
