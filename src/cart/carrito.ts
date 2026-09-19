const KEY = 'the-green-carrito'

export interface CartItem {
  id: string
  nombre: string
  precio: number
  imagen: string
  cantidad: number
}

export function leerCarrito(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as CartItem[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function guardarCarrito(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function totalUnidades(items: CartItem[]) {
  return items.reduce((acc, item) => acc + item.cantidad, 0)
}

export function totalPrecio(items: CartItem[]) {
  return items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
}
