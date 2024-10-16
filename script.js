// Load services from local storage
function loadServices() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const tableBody = document.getElementById('serviceTableBody');
    tableBody.innerHTML = '';

    services.forEach((service, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${service.name}</td>
            <td>${service.description}</td>
            <td>${service.price}</td>
            <td>
                <button onclick="editService(${index})">Edit</button>
                <button onclick="deleteService(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Add a new service
function addService() {
    const name = document.getElementById('serviceName').value;
    const description = document.getElementById('serviceDescription').value;
    const price = document.getElementById('servicePrice').value;

    const services = JSON.parse(localStorage.getItem('services')) || [];
    services.push({ name, description, price });
    localStorage.setItem('services', JSON.stringify(services));

    document.getElementById('serviceName').value = '';
    document.getElementById('serviceDescription').value = '';
    document.getElementById('servicePrice').value = '';

    loadServices();
}

// Edit a service
function editService(index) {
    const services = JSON.parse(localStorage.getItem('services'));
    const service = services[index];

    document.getElementById('serviceName').value = service.name;
    document.getElementById('serviceDescription').value = service.description;
    document.getElementById('servicePrice').value = service.price;

    // Remove service on edit
    deleteService(index);
}

// Delete a service
function deleteService(index) {
    const services = JSON.parse(localStorage.getItem('services'));
    services.splice(index, 1);
    localStorage.setItem('services', JSON.stringify(services));
    loadServices();
}

// Initial load
loadServices();
