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

    