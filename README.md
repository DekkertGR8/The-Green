# The Green · Café & Bar

Sistema frontend del café-bar **The Green**, con identidad vintage-industrial y consumo completo del Mock API asignado.

## Equipo

- Luis Miguel Triviño
- Valentina Diaz Carrillo

## Alcance

La aplicación parte de un proyecto React + TypeScript + Vite y personaliza header, menú y footer. Desde el menú principal se gestionan todos los recursos del Mock API:

- Productos
- Categorías
- Usuarios
- Clientes
- Órdenes
- Estados de la orden

Cada vista lista registros en vivo y permite crear o actualizar mediante formularios.

## Mock API

Base: `https://6aa6bca3d7765db9850791e4.mockapi.io`

La carta, el personal y los clientes se consultan en vivo desde esa API. El listado de referencia está en `docs/carta.json`.

### Productos
Cafés, cócteles, vinos, brunch y postres: Espresso House, Cappuccino Vintage, Cold Brew de Barril, Americano de Casa, Flat White de Casa, Latte de Avellana, Affogato The Green, Negroni de la Casa, Old Fashioned, Espresso Martini, Whisky Sour Ahumado, Gin Tonic Botanico, Manhattan de la Barra, Copa de Malbec, Copa de Sauvignon, Vermut de Casa, Copa de Whisky, Tabla de quesos, Croissant de jamon, Tostada de aguacate, Papas rusticas, Sandwich roast beef, Brownie de cacao, Cheesecake de cafe, Tiramisu de la Casa y Galleta de chocolate.

### Usuarios
Luis Miguel Triviño (administrador), Valentina Diaz Carrillo (bartender), Helena Duarte (chef), Tomás Rivera (barista), Andrés Peña (cajero) y Mariana López (mesero).

### Clientes
Ana Restrepo, Carlos Mejía, Laura Gómez, Sofía Herrera, Mateo Rincón, Juliana Vargas, Diego Salazar y Camila Torres.

## Cómo correrlo

```bash
npm install
npm run dev
```
