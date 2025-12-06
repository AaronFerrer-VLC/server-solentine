/**
 * Tests para Auth Controllers
 */

const { signupUser, loginUser } = require('../../controllers/auth.controllers');
const User = require('../../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock de dependencias
jest.mock('../../models/User.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controllers', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Configurar variables de entorno
    process.env.TOKEN_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '6h';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signupUser', () => {
    it('should create a new user successfully', async () => {
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test1234',
        firstName: 'Test',
        familyName: 'User'
      };

      // Mock User.findOne (no existe usuario)
      User.findOne.mockResolvedValue(null);
      
      // Mock bcrypt
      bcrypt.genSaltSync.mockReturnValue('salt');
      bcrypt.hashSync.mockReturnValue('hashedPassword');
      
      // Mock User.create
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        familyName: 'User',
        role: 'user',
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439011',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          familyName: 'User',
          role: 'user'
        })
      };
      User.create.mockResolvedValue(mockUser);

      await signupUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ email: 'test@example.com' }, { username: 'testuser' }]
      });
      expect(bcrypt.hashSync).toHaveBeenCalledWith('Test1234', 'salt');
      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'User created successfully'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should return error if email already exists', async () => {
      req.body = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'Test1234'
      };

      // Mock User.findOne (usuario existe)
      User.findOne.mockResolvedValue({
        email: 'existing@example.com',
        username: 'otheruser'
      });

      await signupUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email already registered'
        })
      );
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return error if username already exists', async () => {
      req.body = {
        username: 'existinguser',
        email: 'new@example.com',
        password: 'Test1234'
      };

      // Mock User.findOne (usuario existe)
      User.findOne.mockResolvedValue({
        email: 'other@example.com',
        username: 'existinguser'
      });

      await signupUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Username already taken'
        })
      );
    });

    it('should return error if required fields are missing', async () => {
      req.body = {
        username: 'testuser'
        // Falta email y password
      };

      await signupUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should login user successfully with valid credentials', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'Test1234'
      };

      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439011',
          email: 'test@example.com',
          role: 'user'
        })
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue('mock-jwt-token');

      await loginUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compareSync).toHaveBeenCalledWith('Test1234', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'Login successful',
          authToken: 'mock-jwt-token'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should return error if user does not exist', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'Test1234'
      };

      User.findOne.mockResolvedValue(null);

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid email or password'
        })
      );
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return error if password is incorrect', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'WrongPassword'
      };

      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compareSync.mockReturnValue(false);

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid email or password'
        })
      );
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return error if email or password is missing', async () => {
      req.body = {
        email: 'test@example.com'
        // Falta password
      };

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email and password are required'
        })
      );
      expect(User.findOne).not.toHaveBeenCalled();
    });
  });
});

