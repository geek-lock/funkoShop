document.addEventListener('DOMContentLoaded', () => {
    const crearUsuarioForm = document.getElementById('crearUsuarioForm');
    crearUsuarioForm.addEventListener('submit', async (e) => {
        e.preventDefault();
         const formData = new FormData(crearUsuarioForm);
         const passw = formData.get('Pass');
         const confpassw = formData.get('ConfPass');
        
         if (passw === confpassw) {
             const data = {
                 nombre: formData.get('nombre'),
                 apellido: formData.get('apellido'),
                 mail: formData.get('mail'),
                 Pass: passw
             };
        
             const response = await fetch('/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
             const result = await response.json();
             alert(result.message);
             crearUsuarioForm.reset();
             crearUsuarioForm.classList.add('hidden');
             window.location.href = './login.html';
         } else {
             alert('Las contraseñas no coinciden, favor verificar.');
             document.getElementById('Pass').value = '';
             document.getElementById('ConfPass').value = '';
         }
         }); 
});