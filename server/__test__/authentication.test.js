const authentication = require('../middlewares/authentication');
const { verifyToken } = require('../helpers/jwt');

// Mock the jwt helper
jest.mock('../helpers/jwt', () => ({
  verifyToken: jest.fn()
}));

describe('Authentication Middleware', () => {
  let mockReq;
  let mockVerifyToken;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Create a mock request object
    mockReq = {
      headers: {
        authorization: 'Bearer valid-token'
      }
    };
    
    // Set up mock verifyToken implementation
    mockVerifyToken = verifyToken;
  });

  test('should successfully authenticate with valid token', async () => {
    // Mock successful token verification
    const mockUser = { id: '123', username: 'testuser' };
    mockVerifyToken.mockReturnValue(mockUser);

    // Call the authentication function
    const result = await authentication({ req: mockReq });

    // Verify the token was checked with the correct value
    expect(mockVerifyToken).toHaveBeenCalledWith('valid-token');
    
    // Verify the decoded token is returned
    expect(result).toEqual(mockUser);
  });

  test('should throw error when authorization header is missing', async () => {
    // Mock request without authorization header
    mockReq.headers.authorization = '';

    // Call authentication and expect it to throw
    await expect(authentication({ req: mockReq }))
      .rejects
      .toThrow('You must be logged in to access this feature');

    // Verify verifyToken was not called
    expect(mockVerifyToken).not.toHaveBeenCalled();
  });

  test('should throw error when token format is invalid', async () => {
    // Different test cases for invalid token formats
    const invalidFormats = [
      'invalid-format',           // No 'Bearer' prefix
      'NotBearer token123',       // Wrong prefix
      'Bearer ',                  // No token after 'Bearer'
    ];

    for (const invalidFormat of invalidFormats) {
      mockReq.headers.authorization = invalidFormat;
      
      // Call authentication and expect it to throw
      await expect(authentication({ req: mockReq }))
        .rejects
        .toThrow('Invalid token');
      
      // Verify verifyToken was not called
      expect(mockVerifyToken).not.toHaveBeenCalled();
    }
  });

  test('should throw error when token verification fails', async () => {
    // Mock token verification failure
    const errorMessage = 'Invalid signature';
    mockVerifyToken.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    // Call authentication and expect it to throw
    await expect(authentication({ req: mockReq }))
      .rejects
      .toThrow(errorMessage);
    
    // Verify verifyToken was called
    expect(mockVerifyToken).toHaveBeenCalledWith('valid-token');
  });

  test('should throw generic error message when verification throws without message', async () => {
    // Mock token verification throwing error without message
    mockVerifyToken.mockImplementation(() => {
      throw new Error();
    });

    // Call authentication and expect it to throw with default message
    await expect(authentication({ req: mockReq }))
      .rejects
      .toThrow('Authentication failed');
    
    // Verify verifyToken was called
    expect(mockVerifyToken).toHaveBeenCalledWith('valid-token');
  });
});

