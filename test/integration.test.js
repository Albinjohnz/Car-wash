const request = require('supertest');
const { app, startServer, stopServer } = require('../server');

let server;

describe('Services API Integration Tests', () => {
    beforeAll(async () => {
        server = await startServer();
    });

    afterAll(async () => {
        await stopServer(server);
    });

    let createdServiceId;

    it('should create a new service on POST /services', async () => {
        const newService = {
            name: 'Car Wash',
            description: 'Comprehensive exterior car wash',
            price: 15.99
        };

        const response = await request(app).post('/services').send(newService);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Service added successfully');
        expect(response.body).toHaveProperty('serviceId');
        createdServiceId = response.body.serviceId; // Store for later tests
    });

    it('should fetch all services on GET /services', async () => {
        const response = await request(app).get('/services');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should update a service on PUT /services/:id', async () => {
        const updatedService = {
            name: 'Premium Car Wash',
            description: 'Comprehensive exterior and interior car wash',
            price: 25.99
        };

        const response = await request(app).put(`/services/${createdServiceId}`).send(updatedService);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Service updated successfully');
    });

    it('should delete a service on DELETE /services/:id', async () => {
        const response = await request(app).delete(`/services/${createdServiceId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', expect.stringContaining('deleted and IDs reorganized successfully'));
    });

    it('should return 404 for a non-existent route', async () => {
        const response = await request(app).get('/nonexistent');
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'Route not found');
    });
});
