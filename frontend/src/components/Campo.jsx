import { useId, useState } from 'react'
import { IconeOlho } from './Icones'

// Campo de formulário com label, dica e erro associados ao input (RNF-11)
export default function Campo({ label, dica, erro, multilinha = false, contador, type, ...props }) {
  const id = useId()
  const idDica = `${id}-dica`
  const idErro = `${id}-erro`
  const descritoPor = [dica && idDica, erro && idErro].filter(Boolean).join(' ') || undefined
  const Elemento = multilinha ? 'textarea' : 'input'
  const ehSenha = type === 'password' && !multilinha
  const [senhaVisivel, setSenhaVisivel] = useState(false)

  const elemento = (
    <Elemento id={id} aria-invalid={!!erro} aria-describedby={descritoPor}
      type={ehSenha && senhaVisivel ? 'text' : type} {...props} />
  )

  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      {ehSenha ? (
        <div className="campo-senha">
          {elemento}
          <button type="button" className="campo-senha-alternar"
            onClick={() => setSenhaVisivel((v) => !v)}
            aria-label={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={senhaVisivel} aria-controls={id}
            title={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            disabled={props.disabled}>
            <IconeOlho riscado={senhaVisivel} />
          </button>
        </div>
      ) : elemento}
      <div className="campo-rodape">
        {dica && <span id={idDica} className="campo-dica">{dica}</span>}
        {contador && <span className="campo-contador">{contador}</span>}
      </div>
      {erro && <span id={idErro} className="campo-erro">{erro}</span>}
    </div>
  )
}
