
const API_URL = 'http://localhost:3000/services';

async function fetchServices() {
    const response = await fetch(API_URL);
    const services = await response.json();
    const serviceList = document.getElementById('service-list');
    serviceList.innerHTML = ''; 

    services.forEach(service => {
        const serviceItem = document.createElement('li');
        serviceItem.innerHTML = `
            ${service.name} - ${service.description} - $${service.price}
            <button onclick="editService(${service.id})">Edit</button>
            <button onclick="deleteService(${service.id})">Delete</button>
        `;
        serviceList.appendChild(serviceItem);
    });
}

async function addService() {
    const serviceName = document.getElementById('serviceName').value;
    const serviceDescription = document.getElementById('serviceDescription').value;
    const servicePrice = document.getElementById('servicePrice').value;

    if (serviceName && serviceDescription && servicePrice) {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: serviceName, description: serviceDescription, price: servicePrice })
        });
        fetchServices(); 
        document.getElementById('serviceName').value = '';
        document.getElementById('serviceDescription').value = '';
        document.getElementById('servicePrice').value = '';
    } else {
        alert("All fields are required!");
    }
}

