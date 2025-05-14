document.addEventListener('DOMContentLoaded', () => {
    const catalogoDiv = document.getElementById('product-grid');
    const finalizarBtnHeader = document.getElementById('finalizarBtn'); // Renombramos para claridad
    const modal = document.getElementById('modalPedido');
    const cerrarModalBtn = document.getElementById('cerrarModal');
    const listaPedidoModal = document.getElementById('listaPedidoModal');
    const totalPedidoModal = document.getElementById('totalPedidoModal');
    const finalizarPedidoModal = document.getElementById('finalizarPedidoModal');
    const sidebar = document.querySelector('.sidebar-carrito'); // Seleccionamos la barra lateral
    const sidebarLista = document.getElementById('sidebarListaCarrito');
    const sidebarTotal = document.getElementById('sidebarTotal');
    const sidebarTotalItems = document.getElementById('sidebarTotalItems');
    const sidebarVaciar = document.getElementById('sidebarVaciar');
    const sidebarFinalizar = document.getElementById('sidebarFinalizar'); // Botón en la barra lateral

    let carrito = [];

    // Función para actualizar la visualización del carrito en el sidebar
    function actualizarSidebarVisual() {
        sidebarLista.innerHTML = '';
        let totalPrecio = 0;
        let totalItems = 0;

        carrito.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.nombre}</span>
                <div class="carrito-item-controls">
                    <button class="cantidad-btn minus" data-index="${index}">-</button>
                    <span>${item.cantidad}</span>
                    <button class="cantidad-btn plus" data-index="${index}">+</button>
                    <button class="eliminar-sidebar" data-index="${index}">×</button>
                </div>
                <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
            `;
            sidebarLista.appendChild(li);
            totalPrecio += item.precio * item.cantidad;
            totalItems += item.cantidad;
        });

        sidebarTotal.textContent = `$${totalPrecio.toFixed(2)} USD`;
        sidebarTotalItems.textContent = totalItems;
    }

    // Eventos para los botones de cantidad y eliminar en el sidebar
    sidebarLista.addEventListener('click', (event) => {
        if (event.target.classList.contains('cantidad-btn')) {
            const index = parseInt(event.target.dataset.index);
            if (event.target.classList.contains('plus')) {
                carrito[index].cantidad++;
            } else if (event.target.classList.contains('minus') && carrito[index].cantidad > 1) {
                carrito[index].cantidad--;
            }
            actualizarSidebarVisual();
            actualizarPedido();
        } else if (event.target.classList.contains('eliminar-sidebar')) {
            const index = parseInt(event.target.dataset.index);
            carrito.splice(index, 1);
            actualizarSidebarVisual();
            actualizarPedido();
        }
    });

    fetch('https://raw.githubusercontent.com/alaskaenc/fotos-para-catalogo/main/productos.json')
        .then(res => res.json())
        .then(productos => {
            productos.forEach(producto => {
                const card = document.createElement('div');
                card.className = 'product-card';

                const imgPrincipal = document.createElement('img');
                imgPrincipal.src = producto.imagenPrincipal;
                imgPrincipal.alt = producto.nombre;
                card.appendChild(imgPrincipal);

                const nombre = document.createElement('h3');
                nombre.textContent = producto.nombre;
                card.appendChild(nombre);

                const precio = document.createElement('p');
                precio.innerHTML = `<strong>Precio:</strong> $${parseFloat(producto.precio).toFixed(2)} USD`;
                card.appendChild(precio);

                const talles = document.createElement('p');
                talles.innerHTML = `<strong>Talles disponibles:</strong> ${producto.talles.join(', ')}`;
                card.appendChild(talles);

                const colores = document.createElement('div');
                colores.className = 'colores';
                producto.colores.forEach(color => {
                    const colorDiv = document.createElement('div');
                    colorDiv.className = 'color-circulo';
                    colorDiv.style.backgroundColor = color;
                    colores.appendChild(colorDiv);
                });
                card.appendChild(colores);

                const muestrasDiv = document.createElement('div');
                muestrasDiv.className = 'muestras';
                producto.muestras.forEach(muestra => {
                    const muestraImg = document.createElement('img');
                    muestraImg.src = muestra;
                    muestraImg.onclick = () => {
                        imgPrincipal.src = muestra;
                    };
                    muestrasDiv.appendChild(muestraImg);
                });
                card.appendChild(muestrasDiv);

                const controles = document.createElement('div');
                controles.className = 'controles';

                const cantidadInput = document.createElement('input');
                cantidadInput.type = 'number';
                cantidadInput.value = 1;
                cantidadInput.min = 1;
                cantidadInput.max = 100;
                cantidadInput.className = 'cantidad-input';
                controles.appendChild(cantidadInput);

                const btnAgregar = document.createElement('button');
                btnAgregar.textContent = 'Agregar al carrito';
                btnAgregar.className = 'agregar';
                btnAgregar.onclick = () => {
                    const cantidad = parseInt(cantidadInput.value);
                    if (cantidad > 0) {
                        const existente = carrito.find(item => item.nombre === producto.nombre);
                        if (existente) {
                            existente.cantidad += cantidad;
                        } else {
                            carrito.push({
                                nombre: producto.nombre,
                                precio: parseFloat(producto.precio),
                                cantidad
                            });
                        }
                        actualizarPedido();
                        actualizarSidebarVisual();
                    }
                };

                controles.appendChild(btnAgregar);
                card.appendChild(controles);
                catalogoDiv.appendChild(card);
            });
        })
        .catch(err => console.error('Error cargando el catálogo:', err));

    // Función para llenar el modal
    function actualizarPedido() {
        listaPedidoModal.innerHTML = '';
        let total = 0;

        carrito.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.nombre}</td>
                <td>$${item.precio.toFixed(2)} USD</td>
                <td>${item.cantidad}</td>
                <td>$${(item.precio * item.cantidad).toFixed(2)} USD</td>
            `;
            listaPedidoModal.appendChild(tr);
            total += item.precio * item.cantidad;
        });

        totalPedidoModal.textContent = `$${total.toFixed(2)} USD`;
    }

    // Evento para vaciar el carrito
    sidebarVaciar.onclick = () => {
        carrito = [];
        actualizarSidebarVisual();
        actualizarPedido();
    };

    // Evento para finalizar pedido desde la barra lateral (abre el modal)
    sidebarFinalizar.onclick = () => {
        if (!carrito.length) return alert('El carrito está vacío.');
        actualizarPedido();
        modal.style.display = 'flex';
    };

    // Acciones sobre el modal
    finalizarBtnHeader.onclick = () => { // El botón del header ahora solo muestra/oculta la barra lateral
        sidebar.style.display = sidebar.style.display === 'none' || sidebar.style.display === '' ? 'block' : 'none';
    };
    cerrarModalBtn.onclick = () => modal.style.display = 'none';
    finalizarPedidoModal.onclick = () => {
        if (!carrito.length) return alert('El carrito está vacío.');
        let mensaje = '¡Hola! Quiero hacer un pedido:%0A';
        carrito.forEach(i => {
            mensaje += `- ${i.nombre} x${i.cantidad} = $${(i.precio * i.cantidad).toFixed(2)}%0A`;
        });
        mensaje += `%0ATotal: $${carrito.reduce((a,i)=>a+i.precio*i.cantidad,0).toFixed(2)} USD`;
        window.open(`https://wa.me/595982415388?text=${mensaje}`, '_blank');
        modal.style.display = 'none';
    };

    // Inicializar la visualización del carrito y ocultar la barra lateral al inicio
    actualizarSidebarVisual();
    sidebar.style.display = 'none';
});