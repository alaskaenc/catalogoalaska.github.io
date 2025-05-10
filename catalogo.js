const catalogoDiv = document.getElementById('catalogo');

fetch('https://raw.githubusercontent.com/alaskaenc/fotos-para-catalogo/main/productos.json')
  .then(res => res.json())
  .then(productos => {
    productos.forEach(producto => {
      const card = document.createElement('div');
      card.className = 'producto';

      const img = document.createElement('img');
      img.src = producto.imagenPrincipal;
      img.alt = producto.nombre;
      card.appendChild(img);

      const nombre = document.createElement('h3');
      nombre.textContent = producto.nombre;
      card.appendChild(nombre);

      const precio = document.createElement('p');
      precio.textContent = `$${parseFloat(producto.precio).toFixed(2)} USD`;
      card.appendChild(precio);

      const talles = document.createElement('p');
      talles.textContent = `Talles disponibles: ${producto.talles.join(', ')}`;
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
        muestrasDiv.appendChild(muestraImg);
      });
      card.appendChild(muestrasDiv);

      catalogoDiv.appendChild(card);
    });
  })
  .catch(err => {
    console.error('Error cargando el catálogo:', err);
  });
