import { useState, type FormEvent } from 'react'
import { registrarCliente } from '../auth/auth.service'
import { Banner } from '../components/Banner'
import type { Sesion } from '../auth/sesion'
import type { ViewId } from '../config/resources'

interface RegistroPageProps {
  onSesion: (sesion: Sesion) => void
  onCambiarVista: (vista: ViewId) => void
}

export function RegistroPage({ onSesion, onCambiarVista }: RegistroPageProps) {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [telefono, setTelefono] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setError('')
    setEnviando(true)
    try {
      const sesion = await registrarCliente({ nombre, correo, clave, telefono })
      onSesion(sesion)
      onCambiarVista('inicio')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo crear la cuenta. Inténtalo de nuevo.',
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Banner
        eyebrow="Cuenta"
        title="Crear cuenta de cliente"
        subtitle="El registro abre una cuenta de huésped. Las cuentas de empleados las crea el administrador."
      />
      <section className="panel form-panel">
        <form className="resource-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              <span>Nombre completo *</span>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </label>
            <label>
              <span>Teléfono</span>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </label>
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
                minLength={4}
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
            </label>
          </div>
          {error && <p className="status is-error">{error}</p>}
          <div className="form-actions">
            <button type="submit" disabled={enviando}>
              {enviando ? 'Creando...' : 'Registrarme'}
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => onCambiarVista('login')}
            >
              Ya tengo cuenta
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
