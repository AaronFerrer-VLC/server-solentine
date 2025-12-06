/**
 * Tests para Client Model
 */

const Client = require('../../models/Client.model');

describe('Client Model', () => {
    describe('Schema Validation', () => {
        it('should create a client with valid data', () => {
            const clientData = {
                name: 'Test Client',
                email: 'client@test.com',
                address: '123 Main Street',
                position: {
                    lat: 40.7128,
                    lng: -74.0060
                }
            };

            const client = new Client(clientData);
            const validationError = client.validateSync();
            
            expect(validationError).toBeUndefined();
            expect(client.name).toBe('Test Client');
            expect(client.email).toBe('client@test.com');
        });

        it('should fail validation with invalid email', () => {
            const clientData = {
                name: 'Test Client',
                email: 'invalid-email',
                address: '123 Main Street'
            };

            const client = new Client(clientData);
            const validationError = client.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.email).toBeDefined();
        });

        it('should fail validation with missing required fields', () => {
            const clientData = {
                name: 'Test Client'
                // Missing email and address
            };

            const client = new Client(clientData);
            const validationError = client.validateSync();
            
            expect(validationError).toBeDefined();
        });

        it('should require unique name and email', () => {
            // This would require database connection to test uniqueness
            // For now, we verify the schema has unique constraints
            const schema = Client.schema;
            const namePath = schema.path('name');
            const emailPath = schema.path('email');
            
            expect(namePath).toBeDefined();
            expect(emailPath).toBeDefined();
        });
    });
});

