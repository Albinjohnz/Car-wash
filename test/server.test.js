const request = require('supertest'); 
const { app, startServer, stopServer } = require('../server'); 
const db = require('mysql'); 

// Mock MySQL database connection and query functions
jest.mock('mysql', () => {
    const mockPool = {
        query: jest.fn(),
        getConnection: jest.fn((callback) => callback(null, { release: jest.fn() })),
    };
    return {
        createPool: jest.fn(() => mockPool),
    };
});

const mockDb = db.createPool(); 

describe('Service API Endpoints', () => {
    let server;  

    // Start the server before all tests
    beforeAll(async () => {
        server = await startServer();  
        jest.spyOn(console, 'log').mockImplementation(() => {}); 
    });

    // Clear mocks after each test
    afterEach(() => {
        jest.clearAllMocks();  
    });

    // Stop the server and clean up after all tests
    afterAll(async () => {
        await stopServer(server);  
        mockDb.query.mockReset(); 
        jest.restoreAllMocks(); 
    });

    // Test case for POST /services - Create a new service
    test('POST /services - Create a new service', async () => {
        const newService = { 
            name: 'Inception',
            description: 'Christopher Nolan',
            price: 2010,
        };

        // Mock successful database query
        mockDb.query.mockImplementation((sql, params, callback) => {
            expect(sql).toBe('INSERT INTO services (name, description, price) VALUES (?, ?, ?)');
            expect(params).toEqual([newService.name, newService.description, newService.price]);
            callback(null, { insertId: 0 });
        });

        const response = await request(app)
            .post('/services')
            .send(newService);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Service added successfully',
            serviceId: expect.any(Number),
        });

        expect(mockDb.query).toHaveBeenCalledTimes(1);
    });

    // Test case for POST /services - Missing required fields
    test('POST /services - Missing required fields', async () => {
        jest.setTimeout(10000);  

        const newService = { 
            name: '', 
            description: '', 
            price: '' 
        };

        const response = await request(app)
            .post('/services')
            .send(newService);

        // Assertions
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ 
            error: 'All fields (name, description, price) are required' 
        });
    });

    // Test case for POST /services - Simulate database failure
    test('POST /services - Database failure', async () => {
        const newService = {
            name: 'Oil Change',
            description: 'Change the engine oil',
            price: 29.99,
        };

        // Simulate database failure
        mockDb.query.mockImplementation((sql, params, callback) => {
            callback(new Error('Database error'));
        });

        const response = await request(app)
            .post('/services')
            .send(newService);

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Error adding service' });
    });

    