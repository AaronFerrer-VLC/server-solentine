/**
 * Tests para Auth Validators
 */

const { validateSignup, validateLogin } = require('../../validators/auth.validators');
const { ValidationError } = require('../../utils/errors');

describe('Auth Validators', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('validateSignup', () => {
        it('should pass validation with valid data', () => {
            req.body = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'Test1234',
                firstName: 'Test',
                familyName: 'User'
            };

            // Execute all validators
            const validators = validateSignup.slice(0, -1); // All except handleValidationErrors
            validators.forEach(validator => {
                validator(req, res, () => {});
            });

            const handleValidationErrors = validateSignup[validateSignup.length - 1];
            handleValidationErrors(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0]).toBeUndefined(); // No error
        });

        it('should fail validation with invalid email', () => {
            req.body = {
                username: 'testuser',
                email: 'invalid-email',
                password: 'Test1234'
            };

            const validators = validateSignup.slice(0, -1);
            validators.forEach(validator => {
                validator(req, res, () => {});
            });

            const handleValidationErrors = validateSignup[validateSignup.length - 1];
            handleValidationErrors(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
        });

        it('should fail validation with short password', () => {
            req.body = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'Short1'
            };

            const validators = validateSignup.slice(0, -1);
            validators.forEach(validator => {
                validator(req, res, () => {});
            });

            const handleValidationErrors = validateSignup[validateSignup.length - 1];
            handleValidationErrors(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
        });
    });

    describe('validateLogin', () => {
        it('should pass validation with valid data', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Test1234'
            };

            const validators = validateLogin.slice(0, -1);
            validators.forEach(validator => {
                validator(req, res, () => {});
            });

            const handleValidationErrors = validateLogin[validateLogin.length - 1];
            handleValidationErrors(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should fail validation with missing email', () => {
            req.body = {
                password: 'Test1234'
            };

            const validators = validateLogin.slice(0, -1);
            validators.forEach(validator => {
                validator(req, res, () => {});
            });

            const handleValidationErrors = validateLogin[validateLogin.length - 1];
            handleValidationErrors(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
        });
    });
});

