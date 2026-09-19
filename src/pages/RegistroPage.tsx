import { useState, type FormEvent } from 'react'
import { asString, crearRecurso, listarRecurso } from '../api/http'
import { Banner } from '../components/Banner'
import { sesionDesdeUsuario, type Sesion } from '../auth/sesion'
import type { ViewId } from '../config/resources'

interface RegistroPageProps {
  onSesion: (sesion: Sesion) => void
  onCambiarVista: (vista: ViewId) => void
}

function partirNombre(nombre: string) {
  const partes = nombre.trim().split(/\s+/)
  return {
    nombre: partes[0] || nombre,
    apellido: partes.slice(1).join(' ') || 'Casa',
  }
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
    const correoLimpio = correo.trim().toLowerCase()

    try {
      const usuarios = await listarRecurso('usuario')
      const existe = usuarios.some(
        (usuario) => asString(usuario.correo).toLowerCase() === correoLimpio,
      )
      if (existe) {
        setError('Ese correo ya tiene una cuenta.')
        return
      }

      const usuario = await crearRecurso('usuario', {
        nombre: nombre.trim(),
        correo: correoLimpio,
        clave,
        rol: 'cliente',
        estado: true,
      })

      const partes = partirNombre(nombre)
      await crearRecurso('cliente', {
        nombre: partes.nombre,
        apellido: partes.apellido,
        correo: correoLimpio,
        telefono: telefono.trim() || '0000000000',
        direccion: 'The Green',
        estado: true,
      })

      onSesion(sesionDesdeUsuario(usuario))
      onCambiarVista('inicio')
    } catch {
      setError('No se pudo crear la cuenta. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Banner
        eyebrow="Cuenta"
        title="Crear cuenta"
        subtitle="El registro guarda un usuario y un cliente en el Mock API."
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
