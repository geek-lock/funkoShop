document.addEventListener('DOMContentLoaded', () =>
{
    const mostrarCrearUsuarioFormBtn = document.getElementById('mostrarCrearUsuarioFormBtn');
    const crearUsuarioForm = document.getElementById('crearUsuarioForm');
    const editarUsuarioForm = document.getElementById('editarUsuarioForm');
    const listarUsuariosBtn = document.getElementById('listarUsuariosBtn');
    const listaUsuarios = document.getElementById('listaUsuarios');

    //mostrar imagen de multer
const currentImage = document.getElementById('currentImage');


    mostrarCrearUsuarioFormBtn.addEventListener('click',() =>
    { 
        crearUsuarioForm.classList.toggle('hidden');
    });


    //CREAR USUARIOS NUEVOS
    crearUsuarioForm.addEventListener('submit', async (e) => 
    {
        e.preventDefault();//evita qaue la pagina se actualice

        const formData = new FormData(crearUsuarioForm);
        passw = formData.get('Pass');
        confpassw = formData.get('ConfPass');
        if (passw === confpassw){
        const data = 
        {
            nombre: formData.get('nombre'),
            apellido: formData.get('apellido'),
            mail: formData.get('mail'),
            user_pass: passw
            
        }; 
        
        const response = await fetch('/usuarios',
        {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        alert(result.message);
        crearUsuarioForm.reset();
        crearUsuarioForm.classList.add('hidden');
    }else{
        alert('Las contraseñas no coinciden, favor verificar.');
        document.getElementById('Pass').value = '';
        document.getElementById('ConfPass').value = '';
        
    }
        
    });


    //EDITAR USUARIO
    editarUsuarioForm.addEventListener('submit', async(e) => 
    {   
        e.preventDefault();
        const formData = new FormData(editarUsuarioForm);

        const id = formData.get('editID');
        
        const data = 
        {
            nombre: formData.get('editNombre'),
            apellido: formData.get('editApellido'),
            mail: formData.get('editMail')
        };

        const response = await fetch(`/usuarios/${id}`,
        {
            method: 'PUT',
            headers: 
            {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        })

        const result = await response.json();
        alert(result.message);
        editarUsuarioForm.reset();
        editarUsuarioForm.classList.add('hidden');
        listarUsuarios();

    });





    //listar todos los usuarios
    listarUsuariosBtn.addEventListener('click', listarUsuarios);

    async function listarUsuarios()
    {
        const response = await fetch('/usuarios');
        const usuarios = await response.json();

        listaUsuarios.innerHTML = '';

        usuarios.forEach(usuario => 
            {
                const li = document.createElement('li');

                const imageSrc = usuario.ruta_archivo ? `/uploads/${usuario.ruta_archivo}` :'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUBbNf8tPjjMylsbREVGlN1Dj30k5_JVDZOg&s';


                li.innerHTML = `
                    <span> ID: ${usuario.id}, Nombre: ${usuario.nombre}, Apellido: ${usuario.apellido}, Email: ${usuario.mail}  </span>
                    <img src="${imageSrc}" alt="Img de perfil" width="20px">
                    
                    <div class="actions"> 
                        <button class="update" data-id= "${usuario.id}" data-nombre="${usuario.nombre}" data-apellido="${usuario.apellido}" data-mail="${usuario.mail}" data-image="${imageSrc}"> Actualizar </button>
                    
                        <button class="delete" data-id="${usuario.id}"> Eliminar </button>
                    </div>
                
                `;
                listaUsuarios.appendChild(li);
            });

            //ACTUALIZAR USUARIO
            document.querySelectorAll('.update').forEach(button => 
                {
                    button.addEventListener('click', (e) => 
                    {
                        const id = e.target.getAttribute('data-id');
                        const nombre = e.target.getAttribute('data-nombre');
                        const apellido = e.target.getAttribute('data-apellido');
                        const mail = e.target.getAttribute('data-mail');
                        //const imagen = e.target.getAttribute('data-image');


                        document.getElementById('editID').value = id;
                        document.getElementById('editNombre').value = nombre;
                        document.getElementById('editApellido').value = apellido;
                        document.getElementById('editMail').value = mail;
                       // currentImage.src = imagen;



                        editarUsuarioForm.classList.remove('hidden');
                    });
                });


                document.querySelectorAll('.delete').forEach(button =>
                    {
                        button.addEventListener('click', async (e) =>
                        {
                            const id = e.target.getAttribute('data-id');
                            const response = await fetch(`/usuarios/${id}`,
                            {
                                method: 'DELETE'
                            });

                            const result = await response.json();
                            alert(result.message);
                            listarUsuarios();

                        });

                    });


    }


});