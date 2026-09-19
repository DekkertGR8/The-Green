import type { AccesoVista } from '../auth/roles'
import { ROL_ADMIN, ROLES_EMPLEADO } from '../auth/roles'

export type ViewId =
  | 'inicio'
  | 'producto'
  | 'categoria'
  | 'usuario'
  | 'cliente'
  | 'orden'
  | 'estado_orden'
  | 'login'
  | 'registro'
  | 'carrito'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'password'
  | 'url'
  | 'select'
  | 'checkbox'
  | 'date'
  | 'lines'

export interface FieldConfig {
  key: string
  label: string
  type: FieldType
  required?: boolean
  options?: string[]
  optionsFrom?: 'categoria' | 'cliente' | 'estado_orden'
  placeholder?: string
}

export interface ResourceConfig {
  id: Exclude<ViewId, 'inicio'>
  path: string
  label: string
  singular: string
  createLabel: string
  description: string
  fields: FieldConfig[]
  listFields: string[]
  listLabels: Record<string, string>
  layout: 'table' | 'cards'
}

export const NAV_ITEMS: { id: ViewId; label: string; acceso: AccesoVista }[] = [
  { id: 'inicio', label: 'Inicio', acceso: 'publico' },
  { id: 'producto', label: 'Productos', acceso: 'publico' },
  { id: 'cliente', label: 'Clientes', acceso: 'empleado' },
  { id: 'orden', label: 'Órdenes', acceso: 'empleado' },
  { id: 'categoria', label: 'Categorías', acceso: 'admin' },
  { id: 'usuario', label: 'Usuarios', acceso: 'admin' },
  { id: 'estado_orden', label: 'Estados', acceso: 'admin' },
]

export function accesoDeVista(vista: ViewId): AccesoVista {
  return NAV_ITEMS.find((item) => item.id === vista)?.acceso ?? 'publico'
}

export const RESOURCES: ResourceConfig[] = [
  {
    id: 'producto',
    path: 'producto',
    label: 'Productos',
    singular: 'producto',
    createLabel: 'Nuevo producto',
    description: 'Carta de cafés, cócteles y cocina de The Green.',
    layout: 'cards',
    listFields: ['nombre', 'categoria', 'precio', 'stock', 'estado'],
    listLabels: {
      nombre: 'Nombre',
      categoria: 'Categoría',
      precio: 'Precio',
      stock: 'Stock',
      estado: 'Estado',
    },
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      {
        key: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        required: true,
      },
      { key: 'precio', label: 'Precio', type: 'number', required: true },
      { key: 'stock', label: 'Stock', type: 'number', required: true },
      {
        key: 'categoria',
        label: 'Categoría',
        type: 'select',
        required: true,
        optionsFrom: 'categoria',
      },
      {
        key: 'imagen',
        label: 'Imagen (URL)',
        type: 'url',
        placeholder: 'https://...',
      },
      { key: 'estado', label: 'Disponible', type: 'checkbox' },
    ],
  },
  {
    id: 'categoria',
    path: 'categoria',
    label: 'Categorías',
    singular: 'categoría',
    createLabel: 'Nueva categoría',
    description: 'Secciones de la carta: café, barra y cocina.',
    layout: 'table',
    listFields: ['nombre', 'descripcion', 'estado'],
    listLabels: {
      nombre: 'Nombre',
      descripcion: 'Descripción',
      estado: 'Estado',
    },
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      {
        key: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        required: true,
      },
      { key: 'estado', label: 'Activa', type: 'checkbox' },
    ],
  },
  {
    id: 'usuario',
    path: 'usuario',
    label: 'Usuarios',
    singular: 'usuario',
    createLabel: 'Nuevo empleado',
    description: 'Solo el administrador crea y edita cuentas de personal.',
    layout: 'table',
    listFields: ['nombre', 'rol', 'correo', 'estado'],
    listLabels: {
      nombre: 'Nombre',
      rol: 'Rol',
      correo: 'Correo',
      estado: 'Estado',
    },
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'correo', label: 'Correo', type: 'email', required: true },
      { key: 'clave', label: 'Clave', type: 'password', required: true },
      {
        key: 'rol',
        label: 'Rol',
        type: 'select',
        required: true,
        options: [ROL_ADMIN, ...ROLES_EMPLEADO],
      },
      { key: 'estado', label: 'Activo', type: 'checkbox' },
    ],
  },
  {
    id: 'cliente',
    path: 'cliente',
    label: 'Clientes',
    singular: 'cliente',
    createLabel: 'Nuevo cliente',
    description: 'Huéspedes de la casa. El personal puede crearlos, editarlos o darlos de baja.',
    layout: 'table',
    listFields: ['nombre', 'apellido', 'correo', 'telefono', 'estado'],
    listLabels: {
      nombre: 'Nombre',
      apellido: 'Apellido',
      correo: 'Correo',
      telefono: 'Teléfono',
      estado: 'Estado',
    },
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'apellido', label: 'Apellido', type: 'text', required: true },
      { key: 'correo', label: 'Correo', type: 'email', required: true },
      { key: 'telefono', label: 'Teléfono', type: 'text', required: true },
      { key: 'direccion', label: 'Dirección', type: 'text' },
      { key: 'estado', label: 'Activo', type: 'checkbox' },
    ],
  },
  {
    id: 'orden',
    path: 'orden',
    label: 'Órdenes',
    singular: 'orden',
    createLabel: 'Nueva orden',
    description: 'Pedidos de mesa y barra. El personal crea, actualiza y elimina órdenes.',
    layout: 'table',
    listFields: ['cliente', 'fecha', 'metodo_pago', 'total', 'estado_orden'],
    listLabels: {
      cliente: 'Cliente',
      fecha: 'Fecha',
      metodo_pago: 'Método de pago',
      total: 'Total',
      estado_orden: 'Estado',
    },
    fields: [
      {
        key: 'cliente',
        label: 'Cliente',
        type: 'select',
        required: true,
        optionsFrom: 'cliente',
      },
      { key: 'fecha', label: 'Fecha', type: 'date', required: true },
      {
        key: 'estado_orden',
        label: 'Estado de la orden',
        type: 'select',
        required: true,
        optionsFrom: 'estado_orden',
      },
      {
        key: 'metodo_pago',
        label: 'Método de pago',
        type: 'select',
        required: true,
        options: ['Efectivo', 'Tarjeta', 'Transferencia', 'Cortesía'],
      },
      { key: 'total', label: 'Total', type: 'number', required: true },
      { key: 'descuento', label: 'Descuento', type: 'number' },
      {
        key: 'detalle',
        label: 'Detalle (un producto por línea)',
        type: 'lines',
        placeholder: 'Espresso House\nNegroni de la Casa',
      },
    ],
  },
  {
    id: 'estado_orden',
    path: 'estado_orden',
    label: 'Estados de la orden',
    singular: 'estado',
    createLabel: 'Nuevo estado',
    description: 'Ciclo de vida de cada pedido, de la barra a la mesa.',
    layout: 'table',
    listFields: ['nombre', 'descripcion', 'estado'],
    listLabels: {
      nombre: 'Nombre',
      descripcion: 'Descripción',
      estado: 'Estado',
    },
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      {
        key: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        required: true,
      },
      { key: 'estado', label: 'Habilitado', type: 'checkbox' },
    ],
  },
]

export function getResource(id: ViewId) {
  return RESOURCES.find((recurso) => recurso.id === id)
}
