import { useState } from 'react'
import { asMoney } from '../api/http'
import { crearOrden } from '../services/order.service'
import { Banner } from '../components/Banner'
import type { Sesion } from '../auth/sesion'
import { totalPrecio, type CartItem } from '../cart/carrito'
import type { ViewId } from '../config/resources'

interface CarritoPageProps {
  items: CartItem[]
  sesion: Sesion | null
  onCambiarCantidad: (id: string, cantidad: number) => void
  onQuitar: (id: string) => void
  onVaciar: () => void
  onCambiarVista: (vista: ViewId) => void
}

export function CarritoPage({
  items,
  sesion,
  onCambiarCantidad,
  onQuitar,
  onVaciar,
  onCambiarVista,
}: CarritoPageProps) {
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const total = totalPrecio(items)

  const confirmarPedido = async () => {
    if (!sesion) {
      onCambiarVista('login')
      return
    }
    if (items.length === 0) return

    setEnviando(true)
    setError('')
    setMensaje('')
    try {
      const detalle = items.map(
        (item) => `${item.nombre} x${item.cantidad}`,
      )
      await crearOrden({
        cliente: sesion.nombre,
        fecha: new Date().toISOString().slice(0, 10),
        metodo_pago: 'Efectivo',
        total,
        descuento: 0,
        detalle,
        estado_orden: 'Pendiente',
      })
      onVaciar()
      setMensaje('Pedido enviado. Quedó como orden pendiente en la API.')
    } catch {
      setError('No se pudo crear la orden. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Banner
        eyebrow="Pedido"
        title="Carrito"
        subtitle="Arma tu mesa y confirma. El pedido se guarda como una orden en el Mock API."
      />

      {mensaje && <p className="status is-ok">{mensaje}</p>}
      {error && <p className="status is-error">{error}</p>}

      {items.length === 0 && !mensaje && (
        <p className="status">El carrito está vacío. Suma algo de la carta.</p>
      )}

      {items.length > 0 && (
        <section className="panel">
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-row">
                {item.imagen ? (
                  <img src={item.imagen} alt="" />
                ) : (
                  <div className="cart-fallback">TG</div>
                )}
                <div>
                  <h3>{item.nombre}</h3>
                  <p>{asMoney(item.precio)}</p>
                </div>
                <div className="cart-qty">
                  <button
                    type="button"
                    onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}
                  >
                    −
                  </button>
                  <span>{item.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)}
                  >
                    +
                  </button>
                </div>
                <strong>{asMoney(item.precio * item.cantidad)}</strong>
                <button type="button" className="ghost" onClick={() => onQuitar(item.id)}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <p>Total</p>
            <strong>{asMoney(total)}</strong>
          </div>
          <div className="form-actions">
            {!sesion && (
              <p className="status">
                Entra o crea cuenta para confirmar el pedido.
              </p>
            )}
            <button type="button" disabled={enviando} onClick={() => void confirmarPedido()}>
              {sesion
                ? enviando
                  ? 'Enviando...'
                  : 'Confirmar pedido'
                : 'Entrar para pedir'}
            </button>
            <button type="button" className="ghost" onClick={onVaciar}>
              Vaciar
            </button>
          </div>
        </section>
      )}
    </>
  )
}
