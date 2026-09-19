import { useState, type FormEvent } from 'react'
import { asString, listarRecurso } from '../api/http'
import { Banner } from '../components/Banner'
import { sesionDesdeUsuario, type Sesion } from '../auth/sesion'
import type { ViewId } from '../config/resources'

interface LoginPageProps {
  onSesion: (sesion: Sesion) => void
  onCambiarVista: (vista: ViewId) => void
}

export function LoginPage({ onSesion, onCambiarVista }: LoginPageProps) {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setError('')
    setEnviando(true)
    try {
      const usuarios = await listarRecurso('usuario')
      const encontrado = usuarios.find((usuario) => {
        return (
          asString(usuario.correo).toLowerCase() === correo.trim().toLowerCase() &&
          asString(usuario.clave) === clave
        )
      })
      if (!encontrado) {
        setError('Correo o clave incorrectos.')
        return
      }
      onSesion(sesionDesdeUsuario(encontrado))
      onCambiarVista('inicio')
    } catch {
      setError('No se pudo iniciar sesión. Revisa la conexión con la API.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Banner
        eyebrow="Cuenta"
        title="Entrar a The Green"
        subtitle="Usa el correo y la clave de tu usuario en el Mock API."
      />
      <section className="panel form-panel">
        <form className="resource-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              <span>Correo *</span>
              <input
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </label>
            <label>
              <span>Clave *</span>
              <input
                type="password"
                required
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
            </label>
          </div>
          {error && <p className="status is-error">{error}</p>}
          <div className="form-actions">
            <button type="submit" disabled={enviando}>
              {enviando ? 'Entrando...' : 'Entrar'}
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => onCambiarVista('registro')}
            >
              Crear cuenta
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
