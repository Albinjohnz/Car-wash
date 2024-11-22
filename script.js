
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



