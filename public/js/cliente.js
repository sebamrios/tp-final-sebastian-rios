document.addEventListener('DOMContentLoaded', () => {
    // Get client ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('id');

    // 2 — Valida Token
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(`[DEBUG UI] Page: cliente.html, URL Param ID: ${clientId}, Logged User ID: ${user.id}, Role: ${user.role}`);

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

    // Valida ClientID
    if (!clientId) {
        alert('No se especificó un cliente.');
        window.history.back();
        return;
    }

    const clientNameElement = document.getElementById('clientName');
    const clientEmailElement = document.getElementById('clientEmail');
    const petsCountElement = document.getElementById('petsCount');
    const petsTableBody = document.getElementById('petsTableBody');

    // Helper: Select icon based on species
    const getSpeciesIcon = (species) => {
        const s = species ? species.toLowerCase() : 'otro';
        if (s === 'perro') return 'pets';
        if (s === 'gato') return 'pets';
        if (s === 'ave') return 'flutter_dash';
        return 'pets';
    };

    const fetchClientPets = async () => {
        try {
            const response = await fetch(`/api/mascotas/cliente/${clientId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 403) {
                petsTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-slate-500 font-medium italic">No cuenta con la autorización correspondiente.</td></tr>';
                if (createPetBtn) createPetBtn.classList.add('hidden');
                return;
            }

            if (!response.ok) {
                if (response.status === 404) {
                    renderPets([]);
                    return;
                }
                throw new Error('Error al obtener mascotas');
            }

            const pets = await response.json();
            clientPets = pets;
            renderPets(pets);

        } catch (error) {
            console.error('Error:', error);
            petsTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500">Error al cargar datos de mascotas.</td></tr>';
        }
    };

    const fetchClientDetails = async () => {
        try {
            const response = await fetch(`/api/users/${clientId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 403) {
                if (clientNameElement) clientNameElement.textContent = 'Acceso Denegado';
                if (clientEmailElement) clientEmailElement.textContent = 'No cuenta con autorización';
                return;
            }

            if (!response.ok) throw new Error('Error al obtener datos del cliente');

            const user = await response.json();

            // Update UI with user details
            if (clientNameElement) clientNameElement.textContent = user.nombre || 'Sin Nombre';
            if (clientEmailElement) clientEmailElement.innerHTML = `<span class="material-icons-round text-sm">email</span> ${user.email || 'Sin Email'}`;

        } catch (error) {
            console.error("Error fetching client details:", error);
            if (clientNameElement) clientNameElement.textContent = 'Usuario Desconocido';
        }
    };

    const renderPets = (pets) => {
        petsTableBody.innerHTML = '';
        if (petsCountElement) petsCountElement.textContent = (pets && pets.length) || 0;

        if (!pets || pets.length === 0) {
            petsTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-slate-500 italic">Este cliente no tiene mascotas registradas.</td></tr>';
            return;
        }

        pets.forEach(pet => {
            const row = document.createElement('tr');
            row.className = "hover:bg-primary/5 transition-colors group";

            const icon = getSpeciesIcon(pet.especie);
            // 3 — Optional chaining para evitar crash

            row.innerHTML = `
                <td class="table-cell">
                    <div class="flex items-center gap-3">
                        <div>
                            <span class="block font-bold text-slate-900 dark:text-white">${pet.nombre || 'Sin Nombre'}</span>
                            <span class="block text-[10px] text-slate-400 font-medium">ID: ${pet.id}</span>
                        </div>
                    </div>
                </td>
                <td class="table-cell">
                    <div class="flex items-center gap-2">
                        <span class="font-medium capitalize">${pet.especie || 'Desconocido'}</span>
                    </div>
                </td>
                <td class="table-cell">
                    <span class="text-slate-500 font-medium">${pet.raza || '-'}</span>
                </td>
                <td class="table-cell">
                     <span class="text-slate-500 font-medium">${pet.edad || '-'}</span>
                </td>
                <td class="table-cell">
                    <div class="flex items-center gap-2">
                        <button class="action-icon-btn edit-btn text-blue-500 hover:bg-blue-50 rounded-lg p-1 transition-colors" title="Editar">
                            <span class="material-icons-round text-lg">edit</span>
                        </button>
                        <button class="action-icon-btn delete-btn text-red-500 hover:bg-red-50 rounded-lg p-1 transition-colors" title="Eliminar">
                            <span class="material-icons-round text-lg">delete</span>
                        </button>
                    </div>
                </td>
            `;
            petsTableBody.appendChild(row);

            // Attach Events
            const editBtn = row.querySelector('.edit-btn');
            const deleteBtn = row.querySelector('.delete-btn');

            if (editBtn) editBtn.addEventListener('click', () => openModal(pet));
            if (deleteBtn) deleteBtn.addEventListener('click', () => deletePet(pet.id));
        });
    };

    // Modal Elements
    const petModal = document.getElementById('petModal');
    const modalTitle = document.getElementById('modalTitle');
    const petForm = document.getElementById('petForm');
    const createPetBtn = document.getElementById('createPetBtn');
    const savePetBtn = document.getElementById('savePetBtn');
    const cancelPetBtn = document.getElementById('cancelPetBtn');

    // Form Inputs
    const petIdInput = document.getElementById('petId');
    const nombreInput = document.getElementById('nombre');
    const especieInput = document.getElementById('especie');
    const razaInput = document.getElementById('raza');
    const edadInput = document.getElementById('edad');


    // Modal Functions
    const openModal = (pet = null) => {
        petModal.classList.remove('hidden');
        if (pet) {
            modalTitle.textContent = 'Editar Mascota';
            petIdInput.value = pet.id;
            nombreInput.value = pet.nombre;
            especieInput.value = pet.especie;
            razaInput.value = pet.raza;
            edadInput.value = pet.edad || '';
        } else {
            modalTitle.textContent = 'Registrar Mascota';
            petForm.reset();
            petIdInput.value = '';
        }
    };

    const closeModal = () => {
        petModal.classList.add('hidden');
    };

    // Save Pet Logic
    if (savePetBtn) {
        savePetBtn.addEventListener('click', async () => {
            const id = petIdInput.value;
            const nombre = nombreInput.value;
            const especie = especieInput.value;
            const raza = razaInput.value;
            const edad = edadInput.value ? Number(edadInput.value) : null;

            if (!nombre || !especie) {
                alert('Nombre y especie son obligatorios');
                return;
            }

            const payload = {
                nombre,
                especie,
                raza,
                edad
            };

            // Only include id_usuario for creation (POST), not for updates (PUT)
            if (!id) {
                payload.id_usuario = Number(clientId);
            }

            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/mascotas/${id}` : '/api/mascotas';

            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert(id ? 'Mascota actualizada' : 'Mascota registrada');
                    closeModal();
                    await fetchClientPets();
                    // Refresh pet list in historial form
                    fetch(`/api/mascotas/cliente/${clientId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                        .then(res => res.ok ? res.json() : [])
                        .then(pets => {
                            clientPets = pets;
                            populatePetSelect();
                        });
                } else {
                    const data = await response.json();
                    alert('Error: ' + (data.message || 'Error desconocido'));
                }
            } catch (error) {
                console.error('Error saving pet:', error);
                alert('Error al guardar la mascota');
            }
        });
    }

    const deletePet = async (id) => {
        if (!confirm('¿Seguro de eliminar esta mascota?')) return;
        try {
            const response = await fetch(`/api/mascotas/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert('Mascota eliminada');
                fetchClientPets();
            } else {
                const data = await response.json();
                alert('Error al eliminar: ' + (data.message || 'Error desconocido'));
            }
        } catch (e) {
            console.error('Error deleting pet:', e);
            alert('Error al eliminar');
        }
    };

    // ==================== CLINICAL HISTORY MANAGEMENT ====================

    // Clinical History Elements
    const historialTableBody = document.getElementById('historialTableBody');
    const historialModal = document.getElementById('historialModal');
    const historialModalTitle = document.getElementById('historialModalTitle');
    const historialForm = document.getElementById('historialForm');
    const createHistorialBtn = document.getElementById('createHistorialBtn');
    const saveHistorialBtn = document.getElementById('saveHistorialBtn');
    const cancelHistorialBtn = document.getElementById('cancelHistorialBtn');

    // Clinical History Form Inputs
    const historialIdInput = document.getElementById('historialId');
    const historialMascotaIdInput = document.getElementById('historialMascotaId');
    const historialVeterinarioIdInput = document.getElementById('historialVeterinarioId');
    const historialObservacionesInput = document.getElementById('historialObservaciones');
    const historialDiagnosticoInput = document.getElementById('historialDiagnostico');
    const historialTratamientoInput = document.getElementById('historialTratamiento');

    // Store pets and veterinarians data
    let clientPets = [];
    let veterinarians = [];

    const fetchVeterinarians = async () => {
        if (user.role === 'cliente') return; // Clients don't need the list of vets
        try {
            const response = await fetch('/api/users/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const users = await response.json();
                veterinarians = users.filter(u => u.role === 'vet');
            }
        } catch (error) {
            console.error('Error fetching veterinarians:', error);
        }
    };

    const fetchClientHistorial = async () => {
        if (!clientPets.length) {
            historialTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-slate-500">Primero debe registrar mascotas para este cliente.</td></tr>';
            return;
        }

        try {
            // Fetch historial for each pet and aggregate
            const historialPromises = clientPets.map(pet =>
                fetch(`/api/historial/${pet.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            );

            const responses = await Promise.all(historialPromises);

            // Check if any response is 403
            if (responses.some(res => res.status === 403)) {
                historialTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-slate-500 font-medium italic">No cuenta con la autorización correspondiente.</td></tr>';
                if (createHistorialBtn) createHistorialBtn.classList.add('hidden');
                return;
            }

            const historyRecords = await Promise.all(responses.map(res => res.ok ? res.json() : []));
            const allHistorial = historyRecords.flat();

            renderHistorial(allHistorial);
        } catch (error) {
            console.error('Error fetching historial:', error);
            historialTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-red-500">Error al cargar historial clínico.</td></tr>';
        }
    };

    // Render Clinical History
    const renderHistorial = (historialRecords) => {
        historialTableBody.innerHTML = '';

        if (!historialRecords || historialRecords.length === 0) {
            historialTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-slate-500">No hay registros de historial clínico.</td></tr>';
            return;
        }

        historialRecords.forEach(record => {
            const row = document.createElement('tr');
            row.className = "hover:bg-primary/5 transition-colors group";

            const pet = clientPets.find(p => p.id === record.mascotaId);
            const petName = pet ? pet.nombre : 'Desconocido';
            const fecha = record.fecha ? new Date(record.fecha).toLocaleDateString('es-AR') : '-';

            row.innerHTML = `
                <td class="table-cell">
                    <span class="text-sm font-medium">${fecha}</span>
                </td>
                <td class="table-cell">
                    <span class="font-medium">${petName}</span>
                </td>
                <td class="table-cell">
                    <span class="text-sm text-slate-600 dark:text-slate-400">${record.veterinarioNombre || 'Dr. Desconocido'}</span>
                </td>
                <td class="table-cell">
                    <span class="text-sm text-slate-600 dark:text-slate-400">${record.diagnostico || '-'}</span>
                </td>
                <td class="table-cell">
                    <span class="text-sm text-slate-600 dark:text-slate-400">${record.tratamiento || '-'}</span>
                </td>
                <td class="table-cell">
                    <div class="flex items-center gap-2">
                        <button class="action-icon-btn edit-historial-btn text-blue-500 hover:bg-blue-50 rounded-lg p-1 transition-colors" title="Editar">
                            <span class="material-icons-round text-lg">edit</span>
                        </button>
                        <button class="action-icon-btn delete-historial-btn text-red-500 hover:bg-red-50 rounded-lg p-1 transition-colors" title="Eliminar">
                            <span class="material-icons-round text-lg">delete</span>
                        </button>
                    </div>
                </td>
            `;

            historialTableBody.appendChild(row);

            // Attach Events
            const editBtn = row.querySelector('.edit-historial-btn');
            const deleteBtn = row.querySelector('.delete-historial-btn');

            if (editBtn) editBtn.addEventListener('click', () => openHistorialModal(record));
            if (deleteBtn) deleteBtn.addEventListener('click', () => deleteHistorial(record.id));
        });
    };

    // Populate pet select dropdown
    const populatePetSelect = () => {
        historialMascotaIdInput.innerHTML = '<option value="">Seleccione una mascota</option>';
        clientPets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent = `${pet.nombre} (${pet.especie})`;
            historialMascotaIdInput.appendChild(option);
        });
    };

    // Populate veterinarian select dropdown
    const populateVetSelect = () => {
        historialVeterinarioIdInput.innerHTML = '<option value="">Seleccione un veterinario</option>';
        veterinarians.forEach(vet => {
            const option = document.createElement('option');
            option.value = vet.id;
            option.textContent = `Dr. ${vet.nombre}`;
            historialVeterinarioIdInput.appendChild(option);
        });
    };

    // Modal Functions for Clinical History
    const openHistorialModal = (historial = null) => {
        // Check user role
        if (user.role !== 'vet' && user.role !== 'admin') {
            alert('Solo veterinarios y administradores pueden gestionar el historial clínico.');
            return;
        }

        populatePetSelect();
        populateVetSelect();
        historialModal.classList.remove('hidden');

        if (historial) {
            historialModalTitle.textContent = 'Editar Historial Clínico';
            historialIdInput.value = historial.id;
            historialMascotaIdInput.value = historial.mascotaId;
            historialVeterinarioIdInput.value = historial.veterinarioId;
            historialObservacionesInput.value = historial.observaciones;
            historialDiagnosticoInput.value = historial.diagnostico;
            historialTratamientoInput.value = historial.tratamiento;
        } else {
            historialModalTitle.textContent = 'Registrar Historial Clínico';
            historialForm.reset();
            historialIdInput.value = '';
        }
    };

    const closeHistorialModal = () => {
        historialModal.classList.add('hidden');
    };

    // Save Clinical History
    if (saveHistorialBtn) {
        saveHistorialBtn.addEventListener('click', async () => {
            const id = historialIdInput.value;
            const mascotaId = historialMascotaIdInput.value;
            const veterinarioId = historialVeterinarioIdInput.value;
            const observaciones = historialObservacionesInput.value;
            const diagnostico = historialDiagnosticoInput.value;
            const tratamiento = historialTratamientoInput.value;

            if (!mascotaId || !veterinarioId || !observaciones || !diagnostico || !tratamiento) {
                alert('Todos los campos son obligatorios');
                return;
            }

            const payload = {
                observaciones,
                diagnostico,
                tratamiento,
                veterinarioId: Number(veterinarioId)
            };

            // Only include mascotaId for creation (POST), not for updates (PUT)
            if (!id) {
                payload.mascotaId = Number(mascotaId);
            }

            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/historial/${id}` : '/api/historial';

            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert(id ? 'Historial actualizado' : 'Historial registrado');
                    closeHistorialModal();
                    fetchClientHistorial();
                } else {
                    const data = await response.json();
                    alert('Error: ' + (data.message || 'Error desconocido'));
                }
            } catch (error) {
                console.error('Error saving historial:', error);
                alert('Error al guardar el historial');
            }
        });
    }

    // Delete Clinical History
    const deleteHistorial = async (id) => {
        if (!confirm('¿Seguro de eliminar este registro de historial clínico?')) return;

        try {
            const response = await fetch(`/api/historial/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Historial eliminado');
                fetchClientHistorial();
            } else {
                const data = await response.json();
                alert('Error al eliminar: ' + (data.message || 'Error desconocido'));
            }
        } catch (e) {
            console.error('Error deleting historial:', e);
            alert('Error al eliminar');
        }
    };

    // ==================== UI READ-ONLY FOR CLIENTS ====================
    if (user.role === 'cliente') {
        const adminElements = [
            'createPetBtn',
            'createHistorialBtn',
            ...document.querySelectorAll('.edit-btn'),
            ...document.querySelectorAll('.delete-btn'),
            ...document.querySelectorAll('.edit-historial-btn'),
            ...document.querySelectorAll('.delete-historial-btn')
        ];

        adminElements.forEach(el => {
            const domEl = typeof el === 'string' ? document.getElementById(el) : el;
            if (domEl) domEl.classList.add('hidden');
        });

        // Additional check for dynamically rendered rows (we need to hide them after rendering)
        const observer = new MutationObserver(() => {
            document.querySelectorAll('.edit-btn, .delete-btn, .edit-historial-btn, .delete-historial-btn, .action-icon-btn').forEach(btn => {
                btn.classList.add('hidden');
            });
        });

        observer.observe(petsTableBody, { childList: true });
        observer.observe(historialTableBody, { childList: true });
    }

    // Event Listeners for Clinical History
    if (createHistorialBtn) {
        createHistorialBtn.addEventListener('click', () => openHistorialModal());
    }
    if (cancelHistorialBtn) {
        cancelHistorialBtn.addEventListener('click', closeHistorialModal);
    }

    // ==================== END CLINICAL HISTORY MANAGEMENT ====================

    // Event Listeners
    if (createPetBtn) {
        createPetBtn.addEventListener('click', () => openModal());
    }
    if (cancelPetBtn) {
        cancelPetBtn.addEventListener('click', closeModal);
    }

    // ⚠ 7 — Ejecución en paralelo corregida
    const initPage = async () => {
        const promises = [fetchClientDetails(), fetchClientPets()];
        if (user.role !== 'cliente') {
            promises.push(fetchVeterinarians());
        }

        await Promise.all(promises);

        // After pets are loaded, fetch historial
        if (clientPets.length > 0) {
            await fetchClientHistorial();
        }
    };

    initPage();
});
