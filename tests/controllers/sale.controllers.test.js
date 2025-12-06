/**
 * Tests para Sale Controllers
 */

const { getAllSales, saveSale, editSale, deleteSale } = require('../../controllers/sale.controllers');
const Sale = require('../../models/Sale.model');
const User = require('../../models/User.model');
const jwt = require('jsonwebtoken');

jest.mock('../../models/Sale.model');
jest.mock('../../models/User.model');
jest.mock('jsonwebtoken');

describe('Sale Controllers', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            query: {},
            headers: {}
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

    describe('getAllSales', () => {
        it('should return paginated sales', async () => {
            req.query = { page: 1, limit: 10 };
            
            const mockSales = [
                { _id: '1', Fecha: '01/01/2024', Importe: 100 },
                { _id: '2', Fecha: '02/01/2024', Importe: 200 }
            ];

            Sale.countDocuments.mockResolvedValue(20);
            Sale.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockSales)
            });

            await getAllSales(req, res, next);

            expect(Sale.countDocuments).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    sales: mockSales,
                    totalSales: 20,
                    totalPages: 2
                })
            );
        });

        it('should handle empty results', async () => {
            req.query = { page: 1, limit: 10 };
            
            Sale.countDocuments.mockResolvedValue(0);
            Sale.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            });

            await getAllSales(req, res, next);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    sales: [],
                    totalSales: 0,
                    totalPages: 0
                })
            );
        });
    });

    describe('saveSale', () => {
        it('should create a sale successfully', async () => {
            req.body = {
                Id: 1,
                Día: 1,
                Mes: 1,
                Año: 2024,
                Fecha: '01/01/2024',
                Negocio: 'Test Business',
                Importe: 100
            };
            req.headers.authorization = 'Bearer valid-token';
            
            jwt.decode = jest.fn().mockReturnValue({ userId: '507f1f77bcf86cd799439011' });
            
            const mockSale = {
                _id: '507f1f77bcf86cd799439011',
                ...req.body,
                createdBy: '507f1f77bcf86cd799439011'
            };

            Sale.create.mockResolvedValue(mockSale);
            User.findByIdAndUpdate.mockResolvedValue({});

            await saveSale(req, res, next);

            expect(Sale.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should return 401 if user not authenticated', async () => {
            req.body = { Id: 1, Fecha: '01/01/2024', Importe: 100 };
            req.headers.authorization = undefined;

            await saveSale(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(Sale.create).not.toHaveBeenCalled();
        });
    });

    describe('deleteSale', () => {
        it('should delete a sale successfully', async () => {
            req.params.id = '507f1f77bcf86cd799439011';
            const mockSale = {
                _id: req.params.id,
                owner: '507f1f77bcf86cd799439012'
            };

            Sale.findByIdAndDelete.mockResolvedValue(mockSale);
            User.findByIdAndUpdate.mockResolvedValue({});

            await deleteSale(req, res, next);

            expect(Sale.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
            expect(res.sendStatus).toHaveBeenCalledWith(200);
        });

        it('should return 404 if sale not found', async () => {
            req.params.id = '507f1f77bcf86cd799439011';
            Sale.findByIdAndDelete.mockResolvedValue(null);

            await deleteSale(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});

