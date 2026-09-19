import { Banner } from '../components/Banner'
import type { ViewId } from '../config/resources'

interface AccesoDenegadoProps {
  onCambiarVista: (vista: ViewId) => void
}

export function AccesoDenegado({ onCambiarVista }: AccesoDenegadoProps) {
  return (
    <>
      <Banner
        eyebrow="Acceso restringido"
        title="Esta sección es solo para el personal"
        subtitle="La gestión de categorías, usuarios, clientes, órdenes y estados queda reservada al equipo de The Green."
      />
      <section className="panel">
        <p>
          Si eres parte de la casa, entra con una cuenta de empleado. Los
          clientes pueden ver la carta y armar su pedido, pero no la
          información de operación.
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
