let total = 0;
const envio = 400;
let productosCargados = [];

function cambiarCategoria(categoria) {
  const productosContainer = document.getElementById('productos');
  productosContainer.innerHTML = '';

  fetch(`productos/${categoria}.json`)
    .then(res => res.json())
    .then(data => {
      productosCargados = data;

      data.forEach(p => {
        const div = document.createElement('div');
        div.className = 'producto';
        div.innerHTML = `
          <img src="${p.imagen}" alt="${p.nombre}">
          <h2>${p.nombre}</h2>
          <p>Precio: $${p.precio}</p>
          <div>
            <span id="${p.id}">0</span>
            <button onclick="cambiarCantidad('${p.id}', 'sumar', ${p.precio})">+</button>
            <button onclick="cambiarCantidad('${p.id}', 'restar', ${p.precio})">-</button>
          </div>
        `;
        productosContainer.appendChild(div);
      });
    })
    .catch(err => console.error("Error cargando productos:", err));
}

function cambiarCantidad(id, accion, precio) {
  const span = document.getElementById(id);
  let actual = parseInt(span.innerText);

  if (accion === 'sumar') {
    span.innerText = actual + 1;
    total += precio;
  } else if (accion === 'restar' && actual > 0) {
    span.innerText = actual - 1;
    total -= precio;
  }

  actualizarTotal();
}

function actualizarTotal() {
  document.getElementById('total-cantidad').innerText = total;
  document.getElementById('gran-total').innerText = total + envio;
}

function enviarPedido() {
  const direccion = document.getElementById('direccion').value;
  const pedido = [];
  let subtotal = 0;

  productosCargados.forEach(p => {
    const cantidad = parseInt(document.getElementById(p.id).innerText);
    if (cantidad > 0) {
      const totalProducto = cantidad * p.precio;
      pedido.push(`➡ ${p.nombre} - ${cantidad} x $${p.precio} = $${totalProducto}`);
      subtotal += totalProducto;
    }
  });

  const mensaje = `🛒 *Pedido Kiosco Soul* 🛒\n\n📋 *Detalle del pedido:*\n${pedido.join('\n')}\n\n📍 *Dirección:*\n${direccion}\n\n💰 *Subtotal:* $${subtotal}\n🚚 *Envío:* $${envio}\n💵 *Total:* $${subtotal + envio}`;
  window.open(`https://wa.me/5403402590854?text=${encodeURIComponent(mensaje)}`, "_blank");
}
