window.addEventListener('resize', function() {
  const aside = document.getElementById('filter-aside');
  const windowWidth = window.innerWidth;
  const btnFilter = document.getElementById('toggleAsideButton');
  // Si el ancho de la ventana es menor que el breakpoint del menú hamburguesa (por ejemplo, 768px)
  if (windowWidth < 768) {
    aside.classList.add('d-none');
    btnFilter.classList.remove('d-none');
  } else if(windowWidth < 992) {
    aside.classList.add('d-none');
    btnFilter.classList.remove('d-none');
  }else{
    aside.classList.remove('d-none');
    btnFilter.classList.add('d-none');
  }
});

  //------------------------------------------------------------------------------------------------------//
  const asideFilter = document.getElementById('filter-aside');
  const btnFilter = document.getElementById('toggleAsideButton');

  function showAside() {
    asideFilter.classList.remove('d-none');
  }

  function hideAside() {
    asideFilter.classList.add('d-none');
  }

  // Función para manejar el clic en el botón para mostrar/ocultar el aside
  btnFilter.addEventListener('click', (event) => {
    event.stopPropagation(); // Evita que el clic se propague y cierre el aside inmediatamente
    if (asideFilter.classList.contains('d-none')) {
        showAside();
    } else {
        hideAside();
    }
  });

  // Función para ocultar el aside cuando se haga clic en cualquier parte de la página
  document.addEventListener('click', (event) => {
    if (!asideFilter.contains(event.target) && !btnFilter.contains(event.target)) {
      hideAside();
    }
  });

  // Suponiendo que tienes una función para aplicar filtros
  function aplicarFiltros() {
    // Lógica para aplicar filtros
    // Después de aplicar los filtros, ocultamos el aside
    hideAside();
  }