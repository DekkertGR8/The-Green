import { useState } from 'react'
import { asString, type ApiRecord } from '../api/http'
import {
  guardarCarrito,
  leerCarrito,
  type CartItem,
} from '../cart/carrito'

export function useCarrito() {
  const [carrito, setCarrito] = useState<CartItem[]>(() => leerCarrito())

  const actualizarCarrito = (items: CartItem[]) => {
    setCarrito(items)
    guardarCarrito(items)
  }

  const agregarAlCarrito = (producto: ApiRecord) => {
    const id = producto.id
    const precio = Number(producto.precio) || 0
    const existe = carrito.find((item) => item.id === id)
    if (existe) {
      actualizarCarrito(
        carrito.map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item,
        ),
      )
      return
    }
    actualizarCarrito([
      ...carrito,
      {
        id,
        nombre: asString(producto.nombre),
        precio,
        imagen: asString(producto.imagen),
        cantidad: 1,
      },
    ])
  }

  const cambiarCantidad = (id: string, cantidad: number) => {
    if (cantidad < 1) {
      actualizarCarrito(carrito.filter((item) => item.id !== id))
      return
    }
    actualizarCarrito(
      carrito.map((item) => (item.id === id ? { ...item, cantidad } : item)),
    )
  }

  const quitar = (id: string) => {
    actualizarCarrito(carrito.filter((item) => item.id !== id))
  }

  const vaciar = () => actualizarCarrito([])

  return { carrito, agregarAlCarrito, cambiarCantidad, quitar, vaciar }
}
