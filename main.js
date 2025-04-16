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

  productosCargados.forEach(p => {
    const cantidad = parseInt(document.getElementById(p.id).innerText);
    if (cantidad > 0) {
      pedido.push(`${p.nombre} - ${cantidad}`);
    }
  });

  const mensaje = `Quiero encargar:\n${pedido.join('\n')}\n\nDirección:\n${direccion}\n\nTotal: $${total}\nEnvío: $${envio}\nTotal Neto: $${total + envio}`;
  window.open(`https://wa.me/5403402590854?text=${encodeURIComponent(mensaje)}`, "_blank");
}
