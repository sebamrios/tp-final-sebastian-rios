document.addEventListener('DOMContentLoaded', () => {
    console.log('--- Login script initialized ---');

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const nombreInput = document.getElementById('nombre');
    const nameContainer = document.getElementById('nameContainer');
    const submitBtn = document.getElementById('submitBtn');

    if (!loginForm || !submitBtn) {
        console.error('CRITICAL: Login form or submit button not found');
        return;
    }

    let isRegistering = false;

    // ---------- Toggle logic robusta ----------
    function updateMode(registerMode) {
        isRegistering = registerMode;

        if (registerMode) {
            nameContainer.classList.remove('hidden');
            submitBtn.textContent = 'Registrarse';
            nombreInput.required = true;
        } else {
            nameContainer.classList.add('hidden');
            submitBtn.textContent = 'Ingresar a mi cuenta';
            nombreInput.required = false;
        }

        console.log('Modo actualizado:', registerMode ? 'REGISTRO' : 'LOGIN');
    }

    // Radios (caso ideal)
    const toggles = document.querySelectorAll('[name="auth-toggle"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', e => {
            updateMode(e.target.value === 'register');
        });
    });

    // Botones alternativos (si existen)
    const registerBtn = document.getElementById('registerModeBtn');
    const loginBtn = document.getElementById('loginModeBtn');

    if (registerBtn) {
        registerBtn.addEventListener('click', () => updateMode(true));
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => updateMode(false));
    }

    // ---------- Submit ----------
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted. isRegistering:', isRegistering);

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const nombre = nombreInput.value.trim();

        if (!email || !password) {
            alert('Complete los campos requeridos.');
            return;
        }

        if (isRegistering && !nombre) {
            alert('Ingrese su nombre.');
            return;
        }

        const endpoint = isRegistering
            ? '/api/users'
            : '/api/users/login';

        const payload = { email, password };

        if (isRegistering) {
            payload.nombre = nombre;
            payload.role = 'cliente';
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando...';

        try {
            console.log('Sending →', endpoint, payload);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            let data = {};
            try {
                data = await response.json();
            } catch {
                throw new Error('Respuesta inválida del servidor');
            }

            console.log('Response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Error del servidor');
            }

            if (isRegistering) {
                alert('Registro exitoso');
                updateMode(false);
                loginForm.reset();
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            alert('Login exitoso');

            if (data.user.role === 'cliente') {
                window.location.href = `cliente.html?id=${data.user.id}`;
            } else {
                window.location.href = 'mascotas.html';
            }

        } catch (err) {
            console.error('Login error:', err);
            alert(err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = isRegistering
                ? 'Registrarse'
                : 'Ingresar a mi cuenta';
        }
    });
});
