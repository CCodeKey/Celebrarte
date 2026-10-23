import { useCallback, useEffect, useState } from 'react'

// Executa uma busca na API ao montar o componente e expõe dados, erro e carregamento.
// `buscar` deve ser estável (useCallback) ou a busca se repete a cada render.
export function useCarregar(buscar) {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(true)

  const recarregar = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      setDados(await buscar())
    } catch (e) {
      setErro(e)
    } finally {
      setCarregando(false)
    }
  }, [buscar])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  return { dados, setDados, erro, carregando, recarregar }
}
