
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



