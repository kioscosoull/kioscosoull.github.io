let total = 0;
const envio = 400;
let productosCargados = [];
let carrito = JSON.parse(localStorage.getItem('carritoKiosco')) || [];

// Función para cargar productos desde JSON
function cambiarCategoria(categoria) {
  const productosContainer = document.getElementById('productos');
  productosContainer.innerHTML = '';

  fetch(`productos/${categoria}.json`)
    .then(res => res.json())
    .then(data => {
      productosCargados = data;
      renderizarProductos(data);
      actualizarContadoresCarrito();
    })
    .catch(err => console.error("Error cargando productos:", err));
}

// Función para renderizar productos
function renderizarProductos(productos) {
  const productosContainer = document.getElementById('productos');
  
  productos.forEach(p => {
    const itemCarrito = carrito.find(item => item.id === p.id) || { cantidad: 0 };
    
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h2>${p.nombre}</h2>
      <p>Precio: $${p.precio}</p>
      <div class="contador">
        <button onclick="cambiarCantidad('${p.id}', 'restar', ${p.precio})">-</button>
        <span id="${p.id}">${itemCarrito.cantidad}</span>
        <button onclick="cambiarCantidad('${p.id}', 'sumar', ${p.precio})">+</button>
      </div>
    `;
    productosContainer.appendChild(div);
  });
}

// Función para actualizar contadores del carrito
function actualizarContadoresCarrito() {
  carrito.forEach(item => {
    const elemento = document.getElementById(item.id);
    if (elemento) {
      elemento.textContent = item.cantidad;
    }
  });
  calcularTotal();
}

// Función para cambiar cantidad
function cambiarCantidad(id, accion, precio) {
  let item = carrito.find(item => item.id === id);
  
  if (!item) {
    const producto = productosCargados.find(p => p.id === id);
    item = { ...producto, cantidad: 0 };
    carrito.push(item);
  }

  if (accion === 'sumar') {
    item.cantidad++;
  } else if (accion === 'restar' && item.cantidad > 0) {
    item.cantidad--;
  }

  // Eliminar si cantidad es 0
  if (item.cantidad === 0) {
    carrito = carrito.filter(i => i.id !== id);
  }

  // Actualizar localStorage
  localStorage.setItem('carritoKiosco', JSON.stringify(carrito));

  // Actualizar vista
  document.getElementById(id).textContent = item.cantidad;
  calcularTotal();
}

// Función para calcular el total
function calcularTotal() {
  total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  document.getElementById('total-cantidad').textContent = total;
  document.getElementById('gran-total').textContent = total + envio;
}

// Función para enviar pedido
function enviarPedido() {
  const direccion = document.getElementById('direccion').value.trim();
  
  if (carrito.length === 0) {
    alert('¡Tu carrito está vacío! Agrega productos antes de enviar.');
    return;
  }

  if (!direccion) {
    alert('Por favor ingresa tu dirección para el envío.');
    return;
  }

  const itemsPedido = carrito.map(item => 
    `➡ ${item.nombre} - ${item.cantidad} x $${item.precio} = $${item.cantidad * item.precio}`
  ).join('\n');

  const mensaje = ` *Pedido Kiosco Soul* \n\n` +
    `🗒 *Detalle del pedido:*\n${itemsPedido}\n\n` +
    `📍 *Dirección:* ${direccion}\n\n` +
    `💰 *Subtotal:* $${total}\n` +
    `🚚 *Envío:* $${envio}\n` +
    `💵 *Total:* $${total + envio}`;

  window.open(`https://wa.me/5403402590854?text=${encodeURIComponent(mensaje)}`, "_blank");

  // Opcional: limpiar carrito después de enviar
  // carrito = [];
  // localStorage.removeItem('carritoKiosco');
  // actualizarContadoresCarrito();
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  calcularTotal();
  // Puedes cargar una categoría por defecto si lo deseas
  // cambiarCategoria('galletitas');
});
