import { useNavigate } from 'react-router-dom'
import { criarCelebracao } from '../services/celebracoes'
import CelebracaoForm from '../components/CelebracaoForm'

export default function NovaCelebracao() {
  const navigate = useNavigate()

  async function salvar(dados) {
    const celebracao = await criarCelebracao(dados)
    // Leva aos detalhes, onde ficam os links gerados (RF-07, RF-08)
    navigate(`/celebracoes/${celebracao.id}`, { replace: true, state: { criada: true } })
  }

  return (
    <section className="cartao cartao-medio">
      <h1>Nova celebração</h1>
      <p className="texto-suave">Depois de criar, você recebe um link para os convidados e outro para o mural.</p>
      <CelebracaoForm textoBotao="Criar celebração" onSalvar={salvar} onCancelar={() => navigate(-1)} />
    </section>
  )
}
