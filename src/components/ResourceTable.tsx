import { asBoolean, asString, type ApiRecord } from '../api/http'
import type { ResourceConfig } from '../config/resources'

interface ResourceTableProps {
  resource: ResourceConfig
  registros: ApiRecord[]
  onEditar: (registro: ApiRecord) => void
}

function formatearCelda(clave: string, valor: unknown) {
  if (clave === 'clave') return '••••••'
  if (clave === 'estado') return asBoolean(valor) ? 'Activo' : 'Inactivo'
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
