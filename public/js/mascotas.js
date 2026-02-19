document.addEventListener('DOMContentLoaded', () => {
    const petsTableBody = document.getElementById('petsTableBody');
    const createPetBtn = document.getElementById('createPetBtn');
    const petModal = document.getElementById('petModal');
    const modalTitle = document.getElementById('modalTitle');
    const petForm = document.getElementById('petForm');
    const savePetBtn = document.getElementById('savePetBtn');
    const cancelPetBtn = document.getElementById('cancelPetBtn');

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

    // Fields
    const petIdInput = document.getElementById('petId');
    const petNombreInput = document.getElementById('petNombre');
    const petEspecieInput = document.getElementById('petEspecie');
    const petRazaInput = document.getElementById('petRaza');
    const petEdadInput = document.getElementById('petEdad');
    const petOwnerSelect = document.getElementById('petOwner');

    // Helper: Select icon based on species
    const getSpeciesIcon = (species) => {
        const s = species.toLowerCase();
        if (s === 'perro') return 'pets';
        if (s === 'gato') return 'pets'; // Note: Ensure material icons has 'cat' or use 'pets'
        if (s === 'ave') return 'flutter_dash';
        return 'pets';
    };

    // Fetch Users to populate select
    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            if (response.ok) {
                const users = await response.json();
                petOwnerSelect.innerHTML = '<option value="">Seleccione un dueño</option>';
                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = `${user.nombre} (${user.email})`;
                    petOwnerSelect.appendChild(option);
                });
            }
        } catch (e) {
            console.error('Error fetching users for select:', e);
        }
    };

    // Fetch and Render Pets
    const fetchPets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/mascotas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch pets');
            const pets = await response.json();
            renderPets(pets);
        } catch (error) {
            console.error('Error fetching pets:', error);
        }
    };

    const renderPets = (pets) => {
        petsTableBody.innerHTML = '';
        pets.forEach(pet => {
            const row = document.createElement('tr');
            row.className = "group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors";

            const icon = getSpeciesIcon(pet.especie || 'otro');

            row.innerHTML = `
                <td class="table-cell">
                    <div class="flex items-center gap-3">
                        <span class="font-bold text-slate-900 dark:text-white">${pet.nombre}</span>
                    </div>
                </td>
                <td class="table-cell capitalize text-slate-500 font-medium">${pet.especie}</td>
                <td class="table-cell text-slate-500 font-medium">${pet.raza || '-'}</td>
                <td class="table-cell text-slate-500 font-medium">${pet.edad || '-'}</td>
                <td class="table-cell">
                    <a href="cliente.html?id=${pet.usuarioId}" class="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors group/link">
                        <span class="material-icons text-sm group-hover/link:translate-x-0.5 transition-transform">person</span>
                        <span>${pet.ownerName || 'ID: ' + pet.usuarioId}</span>
                    </a>
                </td>
                <td class="table-cell">
                    <div class="flex items-center justify-center gap-1">
                        <button class="action-icon-btn edit-btn" title="Editar Mascota">
                            <span class="material-icons text-lg">edit</span>
                        </button>
                        <button class="action-icon-btn text-red-500 hover:text-red-600 hover:bg-red-50 delete-btn" title="Eliminar Mascota">
                            <span class="material-icons text-lg">delete</span>
                        </button>
                    </div>
                </td>
            `;

            row.querySelector('.edit-btn').addEventListener('click', () => openModal(pet));
            row.querySelector('.delete-btn').addEventListener('click', () => deletePet(pet.id));

            petsTableBody.appendChild(row);
        });
    };

    const openModal = (pet = null) => {
        petModal.classList.remove('hidden');
        if (pet) {
            modalTitle.textContent = 'Editar Mascota';
            petIdInput.value = pet.id;
            petNombreInput.value = pet.nombre;
            petEspecieInput.value = pet.especie;
            petRazaInput.value = pet.raza || '';
            petEdadInput.value = pet.edad || '';
            petOwnerSelect.value = pet.usuarioId;
        } else {
            modalTitle.textContent = 'Registrar Mascota';
            petForm.reset();
            petIdInput.value = '';
        }
    };

    const closeModal = () => {
        petModal.classList.add('hidden');
    };

    savePetBtn.addEventListener('click', async () => {
        const id = petIdInput.value;
        const nombre = petNombreInput.value;
        const especie = petEspecieInput.value;
        const raza = petRazaInput.value;
        const edad = petEdadInput.value;
        const usuarioId = petOwnerSelect.value;

        if (!nombre || !usuarioId) {
            alert("Nombre y Dueño son requeridos");
            return;
        }

        const payload = {
            nombre,
            especie,
            raza,
            edad: edad ? Number(edad) : null,
            usuarioId: Number(usuarioId),
            id_usuario: Number(usuarioId) // Support both field names for controller
        };
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/mascotas/${id}` : '/api/mascotas';

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(id ? 'Mascota actualizada' : 'Mascota creada');
                closeModal();
                fetchPets();
            } else {
                const data = await response.json();
                alert('Error: ' + data.message);
            }
        } catch (e) {
            console.error('Error saving pet:', e);
            alert('Error al guardar');
        }
    });

    const deletePet = async (id) => {
        if (!confirm('¿Seguro de eliminar esta mascota?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/mascotas/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert('Mascota eliminada');
                fetchPets();
            } else {
                alert('Error al eliminar');
            }
        } catch (e) {
            console.error('Error deleting pet:', e);
        }
    };

    createPetBtn.addEventListener('click', () => openModal());
    cancelPetBtn.addEventListener('click', closeModal);

    fetchUsers(); // Populate owner select
    fetchPets();
});
