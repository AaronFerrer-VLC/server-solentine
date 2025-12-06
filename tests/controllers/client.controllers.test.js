/**
 * Tests para Client Controllers
 */

const { getAllClients, createClient, updateClient, deleteClient } = require('../../controllers/client.controllers');
const Client = require('../../models/Client.model');
const { NotFoundError } = require('../../utils/errors');

// Mock de dependencias
jest.mock('../../models/Client.model');
jest.mock('../../services/geocoding.services', () => ({
    getCoordinates: jest.fn()
}));

describe('Client Controllers', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            user: { _id: '507f1f77bcf86cd799439011' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllClients', () => {
        it('should return all clients', async () => {
            const mockClients = [
                { _id: '1', name: 'Client 1', email: 'client1@test.com' },
                { _id: '2', name: 'Client 2', email: 'client2@test.com' }
            ];

            Client.find.mockResolvedValue(mockClients);

            await getAllClients(req, res, next);

            expect(Client.find).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockClients);
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            Client.find.mockRejectedValue(error);

            await getAllClients(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('createClient', () => {
        it('should create a client successfully', async () => {
            req.body = {
                name: 'New Client',
                email: 'new@test.com',
                address: '123 Main St'
            };

            const mockClient = {
                _id: '507f1f77bcf86cd799439011',
                ...req.body,
                position: { lat: 40.7128, lng: -74.0060 },
                save: jest.fn().mockResolvedValue(true)
            };

            Client.create.mockResolvedValue(mockClient);

            await createClient(req, res, next);

            expect(Client.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('updateClient', () => {
        it('should update a client successfully', async () => {
            req.params.id = '507f1f77bcf86cd799439011';
            req.body = { name: 'Updated Client' };

            const mockClient = {
                _id: req.params.id,
                name: 'Updated Client',
                save: jest.fn().mockResolvedValue(true)
            };

            Client.findById.mockResolvedValue(mockClient);

            await updateClient(req, res, next);

            expect(Client.findById).toHaveBeenCalledWith(req.params.id);
            expect(res.json).toHaveBeenCalled();
        });

        it('should return 404 if client not found', async () => {
            req.params.id = '507f1f77bcf86cd799439011';
            Client.findById.mockResolvedValue(null);

            await updateClient(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
        });
    });

    describe('deleteClient', () => {
        it('should delete a client successfully', async () => {
            req.params.id = '507f1f77bcf86cd799439011';
            const mockClient = { _id: req.params.id, name: 'Client to delete' };

            Client.findByIdAndDelete.mockResolvedValue(mockClient);

            await deleteClient(req, res, next);

            expect(Client.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
            expect(res.json).toHaveBeenCalled();
        });

        it('should return 404 if client not found', async () => {
            req.params.id = '507f1f77bcf86cd799439011';
            Client.findByIdAndDelete.mockResolvedValue(null);

            await deleteClient(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
        });
    });
});

