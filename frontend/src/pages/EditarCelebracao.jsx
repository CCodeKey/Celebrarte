import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCarregar } from '../hooks/useCarregar'
import { buscarCelebracao, editarCelebracao } from '../services/celebracoes'
import CelebracaoForm from '../components/CelebracaoForm'
import Alerta from '../components/Alerta'
import Carregando from '../components/Carregando'

export default function EditarCelebracao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dados: celebracao, erro, carregando } = useCarregar(useCallback(() => buscarCelebracao(id), [id]))

  async function salvar(dados) {
    await editarCelebracao(id, dados)
    navigate(`/celebracoes/${id}`, { replace: true })
  }

  return (
    <section className="cartao cartao-medio">
      <h1>Editar celebração</h1>
      {carregando && <Carregando />}
      <Alerta tipo="erro">{erro?.message}</Alerta>
      {celebracao && (
        <CelebracaoForm inicial={celebracao} textoBotao="Salvar alterações" onSalvar={salvar}
          onCancelar={() => navigate(`/celebracoes/${id}`)} />
      )}
    </section>
  )
}
