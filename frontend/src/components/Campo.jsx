import { useId } from 'react'

// Campo de formulário com label, dica e erro associados ao input (RNF-11)
export default function Campo({ label, dica, erro, multilinha = false, contador, ...props }) {
  const id = useId()
  const idDica = `${id}-dica`
  const idErro = `${id}-erro`
  const descritoPor = [dica && idDica, erro && idErro].filter(Boolean).join(' ') || undefined
  const Elemento = multilinha ? 'textarea' : 'input'

  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <Elemento id={id} aria-invalid={!!erro} aria-describedby={descritoPor} {...props} />
      <div className="campo-rodape">
        {dica && <span id={idDica} className="campo-dica">{dica}</span>}
        {contador && <span className="campo-contador">{contador}</span>}
      </div>
      {erro && <span id={idErro} className="campo-erro">{erro}</span>}
    </div>
  )
}
