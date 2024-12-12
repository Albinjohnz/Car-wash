
const API_URL = 'http://localhost:3000/services';

async function fetchServices() {
    const response = await fetch(API_URL);
    const services = await response.json();
    const serviceList = document.getElementById('service-list');
    serviceList.innerHTML = ''; 

    services.forEach(service => {
        const serviceItem = document.createElement('li');
        serviceItem.innerHTML = `
        ${service.id} - ${service.name} - ${service.description} - $${service.price}
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
function showEditForm(id, currentName, currentDescription, currentPrice) {
    const editForm = document.createElement('div');
    editForm.id = 'edit-form';
    editForm.innerHTML = `
        <h3>Edit Service</h3>
        <input type="text" id="edit-name" value="${currentName}" />
        <input type="text" id="edit-description" value="${currentDescription}" />
        <input type="number" id="edit-price" value="${currentPrice}" />
        <button onclick="updateService(${id})">Save</button>
        <button onclick="cancelEdit()">Cancel</button>
    `;
  
    const editFormContainer = document.getElementById('edit-form-container');
    editFormContainer.innerHTML = '';
    editFormContainer.appendChild(editForm);
  }
  
  function cancelEdit() {
    fetchServices();
    document.getElementById('edit-form-container').innerHTML = '';
  }
  
  async function updateService(id) {
    const name = document.getElementById('edit-name').value;
    const description = document.getElementById('edit-description').value;
    const price = document.getElementById('edit-price').value;
  
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price })
      });
  
      if (response.ok) {
        try {
          await fetchServices();
          cancelEdit();
        } catch (error) {
          console.error('Error fetching services:', error);
        }
      } else {
        alert("Failed to update the service.");
      }
    } catch (error) {
      console.error('Error updating service:', error);
    }
  }
async function deleteService(serviceId) {
    if (confirm('Are you sure you want to delete this service?')) {
        await fetch(`${API_URL}/${serviceId}`, {
            method: 'DELETE'
        });
        fetchServices(); 
    }
}
document.addEventListener('DOMContentLoaded', fetchServices);
