document.addEventListener('DOMContentLoaded', () => {
    const usersTableBody = document.getElementById('usersTableBody');
    const createUserBtn = document.getElementById('createUserBtn');
    const userModal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const userForm = document.getElementById('userForm');
    const saveUserBtn = document.getElementById('saveUserBtn');
    const cancelUserBtn = document.getElementById('cancelUserBtn');

    // 🔴 2 — Valida Token
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        alert("Sesión expirada o no iniciada.");
        window.location.href = "login.html";
        return;
    }

    // Update Header User Info
    const currentUserDisplay = document.getElementById('currentUserDisplay');
    if (currentUserDisplay && user.nombre) {
        currentUserDisplay.textContent = user.nombre;
    }

    // Logout Logic
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = "login.html";
        });
    }

    // Form Fields
    const userIdInput = document.getElementById('userId');
    const userNombreInput = document.getElementById('userNombre');
    const userEmailInput = document.getElementById('userEmail');
    const userPasswordInput = document.getElementById('userPassword');
    const userRoleInput = document.getElementById('userRole');

    // Fetch and Render Users
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users', {
                headers: { 'Authorization': `Bearer ${token}` } // If auth middleware is enabled later
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const users = await response.json();
            renderUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const renderUsers = (users) => {
        usersTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.className = "group hover:bg-primary/[0.02] dark:hover:bg-primary/[0.05] transition-colors";

            const roleContent = user.role === 'cliente'
                ? `<div class="flex items-center gap-2">
                     <span>${user.role}</span>
                     <button class="action-icon-btn view-pets-btn text-blue-500 hover:text-blue-600" title="Ver Mascotas">
                         <span class="material-icons text-sm">pets</span>
                     </button>
                   </div>`
                : user.role;

            row.innerHTML = `
                <td class="table-cell">
                    <div class="flex items-center gap-3">
                        <div>
                            <p class="text-sm font-bold text-slate-900 dark:text-white">${user.nombre || 'Sin Nombre'}</p>
                            <p class="text-xs text-slate-500">ID: ${user.id}</p>
                        </div>
                    </div>
                </td>
                <td class="table-cell">
                    <span class="text-sm text-slate-600 dark:text-slate-400">${user.email}</span>
                </td>
                <td class="table-cell">
                    ${roleContent}
                </td>
                <td class="table-cell">
                    <div class="flex items-center justify-center gap-1">
                        <button class="action-icon-btn edit-btn" title="Editar Usuario">
                            <span class="material-icons text-lg">edit</span>
                        </button>
                        <button class="action-icon-btn text-red-500 hover:text-red-600 hover:bg-red-50 delete-btn" title="Eliminar Usuario">
                            <span class="material-icons text-lg">delete</span>
                        </button>
                    </div>
                </td>
            `;

            // Attach Events
            const viewPetsBtn = row.querySelector('.view-pets-btn');
            if (viewPetsBtn) {
                viewPetsBtn.addEventListener('click', () => {
                    window.location.href = `cliente.html?id=${user.id}`;
                });
            }
            row.querySelector('.edit-btn').addEventListener('click', () => openModal(user));
            row.querySelector('.delete-btn').addEventListener('click', () => deleteUser(user.id));

            usersTableBody.appendChild(row);
        });
    };

    // Modal Logic
    const openModal = (user = null) => {
        userModal.classList.remove('hidden');
        if (user) {
            modalTitle.textContent = 'Editar Usuario';
            userIdInput.value = user.id;
            userNombreInput.value = user.nombre;
            userEmailInput.value = user.email;
            userRoleInput.value = user.role;
            userPasswordInput.placeholder = "Dejar en blanco para mantener actual";
            userPasswordInput.required = false;
        } else {
            modalTitle.textContent = 'Registrar Usuario';
            userForm.reset();
            userIdInput.value = '';
            userPasswordInput.placeholder = "Contraseña";
            userPasswordInput.required = true;
        }
    };

    const closeModal = () => {
        userModal.classList.add('hidden');
    };

    // Save Logic
    saveUserBtn.addEventListener('click', async () => {
        const id = userIdInput.value;
        const nombre = userNombreInput.value;
        const email = userEmailInput.value;
        const password = userPasswordInput.value;
        const role = userRoleInput.value;

        const payload = { nombre, email, role };
        if (password) payload.password = password;

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/users/${id}` : '/api/users';

        try {
            const token = localStorage.getItem('token'); // Might need token for admin actions
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(id ? 'Usuario actualizado' : 'Usuario creado');
                closeModal();
                fetchUsers();
            } else {
                const data = await response.json();
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error al guardar');
        }
    });

    // Delete Logic
    const deleteUser = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Usuario eliminado');
                fetchUsers();
            } else {
                alert('Error al eliminar');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Event Listeners
    createUserBtn.addEventListener('click', () => openModal());
    cancelUserBtn.addEventListener('click', closeModal);

    // Initial Fetch
    fetchUsers();
});
