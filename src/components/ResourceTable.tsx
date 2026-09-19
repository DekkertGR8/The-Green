import { asBoolean, asString, type ApiRecord } from '../api/http'
import type { ResourceConfig } from '../config/resources'

interface ResourceTableProps {
  resource: ResourceConfig
  registros: ApiRecord[]
  onEditar: (registro: ApiRecord) => void
}

const METODOS_PAGO: Record<string, string> = {
  'metodo_pago 6': 'Transferencia',
  'metodo_pago 7': 'Efectivo',
}

const ESTADOS_ORDEN: Record<string, string> = {
  'estado_orden 6': 'Pendiente',
  'estado_orden 7': 'En preparacion',
}

function formatearMetodoPago(valor: unknown) {
  const texto = asString(valor)
  return METODOS_PAGO[texto.toLowerCase()] ?? texto
}

function formatearEstadoOrden(valor: unknown) {
  const texto = asString(valor)
  return ESTADOS_ORDEN[texto.toLowerCase()] ?? texto
}

function formatearCelda(clave: string, valor: unknown) {
  if (clave === 'clave') return '••••••'
  if (clave === 'estado') return asBoolean(valor) ? 'Activo' : 'Inactivo'
  if (clave === 'metodo_pago') return formatearMetodoPago(valor) || '—'
  if (clave === 'estado_orden') return formatearEstadoOrden(valor) || '—'
  if (clave === 'precio' || clave === 'total' || clave === 'descuento') {
    const numero = Number(valor)
    if (!Number.isNaN(numero)) return `$ ${numero.toLocaleString('es-CO')}`
  }
  return asString(valor) || '—'
}

export function ResourceTable({
  resource,
  registros,
  onEditar,
}: ResourceTableProps) {
  return (
    <div className="table-wrap">
      <table className="ledger-table">
        <thead>
          <tr>
            {resource.listFields.map((campo) => (
              <th key={campo}>{resource.listLabels[campo] ?? campo}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id}>
              {resource.listFields.map((campo) => (
                <td key={campo}>{formatearCelda(campo, registro[campo])}</td>
              ))}
              <td>
                <button type="button" onClick={() => onEditar(registro)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
