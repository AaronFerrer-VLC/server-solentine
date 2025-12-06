/**
 * Tests para User Model
 */

const User = require('../../models/User.model');

describe('User Model', () => {
  describe('Schema Validation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test1234',
        firstName: 'Test',
        familyName: 'User'
      };

      const user = new User(userData);
      const validationError = user.validateSync();
      
      expect(validationError).toBeUndefined();
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('user'); // Default role
    });

    it('should fail validation with invalid email', () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'Test1234'
      };

      const user = new User(userData);
      const validationError = user.validateSync();
      
      expect(validationError).toBeDefined();
      expect(validationError.errors.email).toBeDefined();
    });

    it('should fail validation with short password', () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Short1'
      };

      const user = new User(userData);
      const validationError = user.validateSync();
      
      expect(validationError).toBeDefined();
      expect(validationError.errors.password).toBeDefined();
    });

    it('should fail validation with short username', () => {
      const userData = {
        username: 'ab',
        email: 'test@example.com',
        password: 'Test1234'
      };

      const user = new User(userData);
      const validationError = user.validateSync();
      
      expect(validationError).toBeDefined();
      expect(validationError.errors.username).toBeDefined();
    });

    it('should fail validation with invalid username format', () => {
      const userData = {
        username: 'test user',
        email: 'test@example.com',
        password: 'Test1234'
      };

      const user = new User(userData);
      const validationError = user.validateSync();
      
      expect(validationError).toBeDefined();
      expect(validationError.errors.username).toBeDefined();
    });

    it('should set default role to user', () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test1234'
      };

      const user = new User(userData);
      expect(user.role).toBe('user');
    });

    it('should accept admin role', () => {
      const userData = {
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'Test1234',
        role: 'admin'
      };

      const user = new User(userData);
      expect(user.role).toBe('admin');
    });

    it('should fail validation with invalid role', () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test1234',
        role: 'invalid-role'
      };

      const user = new User(userData);
      const validationError = user.validateSync();
      
      expect(validationError).toBeDefined();
      expect(validationError.errors.role).toBeDefined();
    });
  });

  describe('toJSON transformation', () => {
    it('should not include password in JSON output', () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test1234'
      };

      const user = new User(userData);
      const json = user.toJSON();
      
      expect(json.password).toBeUndefined();
      expect(json.__v).toBeUndefined();
    });
  });
});

