import { Banner } from '../components/Banner'
import type { ViewId } from '../config/resources'

interface AccesoDenegadoProps {
  onCambiarVista: (vista: ViewId) => void
  requiereAdmin?: boolean
}

export function AccesoDenegado({
  onCambiarVista,
  requiereAdmin = false,
}: AccesoDenegadoProps) {
  return (
    <>
      <Banner
        eyebrow="Acceso restringido"
        title={
          requiereAdmin
            ? 'Esta sección es solo para el administrador'
            : 'Esta sección es solo para el personal'
        }
        subtitle={
          requiereAdmin
            ? 'Crear empleados, categorías y estados de orden queda reservado al admin de The Green.'
            : 'Clientes y órdenes los gestiona el personal. La carta pública sigue abierta para pedir.'
        }
      />
      <section className="panel">
        <p>
          {requiereAdmin
            ? 'Si eres administrador, entra con esa cuenta para dar de alta empleados. Ellos podrán crear, editar y eliminar clientes y órdenes.'
            : 'Si eres parte de la casa, entra con una cuenta de empleado. Los clientes no ven la operación.'}
        </p>
        <div className="form-actions">
          <button type="button" onClick={() => onCambiarVista('login')}>
            Entrar
          </button>
          <button type="button" className="ghost" onClick={() => onCambiarVista('inicio')}>
            Volver al inicio
          </button>
        </div>
      </section>
    </>
  )
}
