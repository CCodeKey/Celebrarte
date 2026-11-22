import { useCallback, useEffect, useState } from 'react'

const SEMPRE_ATUAL = () => true

// Executa uma busca na API ao montar o componente e expõe dados, erro e carregamento.
// `buscar` deve ser estável (useCallback ou função de módulo) ou a busca se repete a cada render.
export function useCarregar(buscar) {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // `atual` diz se a resposta ainda interessa: uma busca antiga (parâmetro trocado ou
  // componente desmontado) não pode sobrescrever o resultado da mais recente
  const executar = useCallback(async (atual = SEMPRE_ATUAL) => {
    setCarregando(true)
    setErro(null)
    try {
      const resposta = await buscar()
      if (atual()) setDados(resposta)
    } catch (e) {
      if (atual()) setErro(e)
    } finally {
      if (atual()) setCarregando(false)
    }
  }, [buscar])

  useEffect(() => {
    let ativa = true
    executar(() => ativa)
    return () => {
      ativa = false
    }
  }, [executar])

  const recarregar = useCallback(() => executar(), [executar])

  return { dados, setDados, erro, carregando, recarregar }
}
