document.addEventListener('DOMContentLoaded', () => {
    const mostrarCrearUsuarioFormBtn = document.getElementById('mostrarCrearUsuarioFormBtn');
    const crearUsuarioForm = document.getElementById('crearUsuarioForm');
    const editarUsuarioForm = document.getElementById('editarUsuarioForm');
    const listarUsuariosBtn = document.getElementById('listarUsuariosBtn');
    const listaUsuarios = document.getElementById('listaUsuarios');
    const loginForm = document.getElementById('loginForm');
    const loggedInUserDisplay = document.getElementById('loggedInUserDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const updateBtn = document.getElementById('updateUser');
    const deleteBtn = document.getElementById('deleteUser');
    const titlelog = document.getElementById('titlelog');
    const registerbtn = document.getElementById('registerbtn');
    var idLogin = 0;
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (result.success) {
            
            localStorage.setItem('idUser', result.idUser);
            localStorage.setItem('loggedEmail', email);
            loginForm.reset();
            loginForm.classList.add('hidden');
            titlelog.classList.add('hidden');
            loggedInUserDisplay.textContent = `Usuario logeado: ${email}`;
            loggedInUserDisplay.classList.remove('hidden');
           
            startLogoutTimer();
            window.location.href = './login.html';
        } else {
            alert('Credenciales incorrectas, por favor intenta nuevamente');
        }
    });

    logoutBtn.addEventListener('click', () => {
        
        localStorage.clear();
        loginForm.classList.remove('hidden');
        loggedInUserDisplay.textContent = '';
        loggedInUserDisplay.classList.add('hidden');
        logoutBtn.classList.add('hidden');
        deleteBtn.classList.add('hidden');
        updateBtn.classList.add('hidden');
        titlelog.classList.remove('hidden');
    });
    updateBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        editarUsuarioForm.classList.remove('hidden');


    });
    cancelUpdate.addEventListener('click', async (e) => {
        e.preventDefault();
        editarUsuarioForm.classList.add('hidden');


    });
    deleteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        loginForm.classList.remove('hidden');
        loggedInUserDisplay.textContent = '';
        loggedInUserDisplay.classList.add('hidden');
        logoutBtn.classList.add('hidden');
        deleteBtn.classList.add('hidden');
        updateBtn.classList.add('hidden');
        titlelog.classList.remove('hidden');
        const response = await fetch(`/usuarios/${localStorage.getItem('idUser')}`, {
            method: 'DELETE'
            }
        );
        localStorage.clear();
        alert('El user ha sido eliminado');

    });
    
    // Mostrar datos del usuario logeado al cargar la página
    const loggedEmail = localStorage.getItem('loggedEmail');
    if (loggedEmail) {
        loggedInUserDisplay.textContent = `Usuario logeado: ${loggedEmail}`;
        loggedInUserDisplay.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        deleteBtn.classList.remove('hidden');
        updateBtn.classList.remove('hidden');
        loginForm.classList.add('hidden');
        titlelog.classList.add('hidden');

        startLogoutTimer();
    }

    // Cerrar sesión automáticamente después de 2 minutos de inactividad
    let timeout;

    function resetTimeout() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            localStorage.clear();
            loginForm.classList.remove('hidden');
            loggedInUserDisplay.textContent = '';
            loggedInUserDisplay.classList.add('hidden');
            logoutBtn.classList.add('hidden');
            deleteBtn.classList.add('hidden');
            updateBtn.classList.add('hidden');
            alert('Sesión cerrada automáticamente por inactividad');
        }, 120000); // 2 minutos en milisegundos
    }

    // Detectar actividad del usuario para reiniciar el temporizador
    document.addEventListener('mousemove', resetTimeout);
    document.addEventListener('keypress', resetTimeout);

    
    // EDITAR USUARIO
    editarUsuarioForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editarUsuarioForm);
        const id = localStorage.getItem('idUser');
        const data = {
            nombre: formData.get('editNombre'),
            apellido: formData.get('editApellido'),
            mail: formData.get('editMail'),
            pass: formData.get('editPass')
        };

        const response = await fetch(`/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        localStorage.setItem('loggedEmail', data.mail);
        loggedInUserDisplay.textContent = `Usuario logeado: ${loggedEmail}`;
        window.location.href = './login.html';
        alert(result.message);
        editarUsuarioForm.reset();
        editarUsuarioForm.classList.add('hidden');
        
    });

    // LISTAR TODOS LOS USUARIOS
  /*  listarUsuariosBtn.addEventListener('click', listarUsuarios);

    async function listarUsuarios() {
        const response = await fetch('/usuarios');
        const usuarios = await response.json();

        listaUsuarios.innerHTML = '';

        usuarios.forEach(usuario => {
            const li = document.createElement('li');

            const imageSrc = usuario.ruta_archivo ? `/uploads/${usuario.ruta_archivo}` : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUBbNf8tPjjMylsbREVGlN1Dj30k5_JVDZOg&s';

            li.innerHTML = `
                <span> ID: ${usuario.id}, Nombre: ${usuario.nombre}, Apellido: ${usuario.apellido}, Email: ${usuario.mail}  </span>
                <img src="${imageSrc}" alt="Img de perfil" width="20px">
                
                <div class="actions"> 
                    <button class="update" data-id="${usuario.id}" data-nombre="${usuario.nombre}" data-apellido="${usuario.apellido}" data-mail="${usuario.mail}" data-image="${imageSrc}"> Actualizar </button>
                
                    <button class="delete" data-id="${usuario.id}"> Eliminar </button>
                </div>
            
            `;
            listaUsuarios.appendChild(li);
        });

        // ACTUALIZAR USUARIO
        document.querySelectorAll('.update').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const nombre = e.target.getAttribute('data-nombre');
                const apellido = e.target.getAttribute('data-apellido');
                const mail = e.target.getAttribute('data-mail');

                document.getElementById('editID').value = id;
                document.getElementById('editNombre').value = nombre;
                document.getElementById('editApellido').value = apellido;
                document.getElementById('editMail').value = mail;

                editarUsuarioForm.classList.remove('hidden');
            });
        });

        
    }*/

    // Función para mostrar datos del usuario logeado
    function showLoggedInUser(email) {
        loggedInUserDisplay.textContent = `Usuario logeado: ${email}`;
        loggedInUserDisplay.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        loginForm.classList.add('hidden');
        titlelog.classList.add('hidden');
        startLogoutTimer();
    }

    // Función para iniciar el temporizador de cierre de sesión
    function startLogoutTimer() {
        let timeout;

        function resetTimeout() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                localStorage.removeItem('loggedEmail');
                loginForm.classList.remove('hidden');
                loggedInUserDisplay.textContent = '';
                loggedInUserDisplay.classList.add('hidden');
                logoutBtn.classList.add('hidden');
                alert('Sesión cerrada automáticamente por inactividad');
            }, 120000); // 2 minutos en milisegundos
        }

        document.addEventListener('mousemove', resetTimeout);
        document.addEventListener('keypress', resetTimeout);

        resetTimeout();
    }

    
});
