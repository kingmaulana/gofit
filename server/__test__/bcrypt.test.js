const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const bcrypt = require('bcryptjs');

// Mock bcryptjs library
jest.mock('bcryptjs', () => ({
  genSaltSync: jest.fn(),
  hashSync: jest.fn(),
  compareSync: jest.fn()
}));

describe('Bcrypt Helper', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password successfully', () => {
      // Mock implementations
      const mockSalt = 'mock-salt';
      const mockHashedPassword = 'hashed-password-123';
      
      bcrypt.genSaltSync.mockReturnValue(mockSalt);
      bcrypt.hashSync.mockReturnValue(mockHashedPassword);
      
      const password = 'test-password';
      const result = hashPassword(password);
      
      // Assertions
      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, mockSalt);
      expect(result).toBe(mockHashedPassword);
    });
    
    it('should handle errors when generating salt', () => {
      // Mock error during salt generation
      bcrypt.genSaltSync.mockImplementation(() => {
        throw new Error('Salt generation failed');
      });
      
      // Attempt to hash password should throw error
      expect(() => {
        hashPassword('test-password');
      }).toThrow('Salt generation failed');
      
      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
      expect(bcrypt.hashSync).not.toHaveBeenCalled();
    });
    
    it('should handle errors during password hashing', () => {
      // Mock implementations
      const mockSalt = 'mock-salt';
      bcrypt.genSaltSync.mockReturnValue(mockSalt);
      
      // Mock error during hashing
      bcrypt.hashSync.mockImplementation(() => {
        throw new Error('Hashing failed');
      });
      
      // Attempt to hash password should throw error
      expect(() => {
        hashPassword('test-password');
      }).toThrow('Hashing failed');
      
      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
      expect(bcrypt.hashSync).toHaveBeenCalled();
    });
  });
  
  describe('comparePassword', () => {
    it('should return true when passwords match', () => {
      // Mock successful comparison
      bcrypt.compareSync.mockReturnValue(true);
      
      const password = 'test-password';
      const hashedPassword = 'hashed-password-123';
      
      const result = comparePassword(password, hashedPassword);
      
      // Assertions
      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });
    
    it('should return false when passwords do not match', () => {
      // Mock failed comparison
      bcrypt.compareSync.mockReturnValue(false);
      
      const password = 'wrong-password';
      const hashedPassword = 'hashed-password-123';
      
      const result = comparePassword(password, hashedPassword);
      
      // Assertions
      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });
    
    it('should handle errors during password comparison', () => {
      // Mock error during comparison
      bcrypt.compareSync.mockImplementation(() => {
        throw new Error('Comparison failed');
      });
      
      const password = 'test-password';
      const hashedPassword = 'hashed-password-123';
      
      // Attempt to compare passwords should throw error
      expect(() => {
        comparePassword(password, hashedPassword);
      }).toThrow('Comparison failed');
      
      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
    });
  });
});

