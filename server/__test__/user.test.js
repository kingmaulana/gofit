const UserModel = require("../models/userModel");
const { userResolvers } = require("../schemas/userSchema");
const { ObjectId } = require('mongodb');
const { signToken } = require("../helpers/jwt");

// Mock dependencies
jest.mock("../config/mongodb", () => ({
    database: {
        collection: jest.fn(() => ({
            findOne: jest.fn(),
            insertOne: jest.fn()
        }))
    }
}));

jest.mock("../helpers/bcrypt", () => ({
    hashPassword: jest.fn(() => "hashedPassword"),
    comparePassword: jest.fn()
}));

jest.mock("../helpers/jwt", () => ({
    signToken: jest.fn(() => "test-token"),
    verifyToken: jest.fn()
}));

jest.mock("../models/userGoalModel", () => ({
    createGoal: jest.fn(),
    createSuggestionAI: jest.fn()
}));

describe("UserModel Error Tests", () => {
    let mockCollection;

    beforeEach(() => {
        // Reset mock implementations
        jest.clearAllMocks();

        // Setup mock collection
        mockCollection = {
            findOne: jest.fn(),
            insertOne: jest.fn()
        };
        require("../config/mongodb").database.collection.mockReturnValue(mockCollection);
    });

    describe("register method", () => {
        test("should throw error when username is empty", async () => {
            const newUser = {
                username: "",
                email: "test@example.com",
                password: "password123",
                weight: 70,
                age: 25,
                height: 170
            };

            await expect(UserModel.register(newUser)).rejects.toThrow("Please input your username.");
        });

        test("should throw error when username is too short", async () => {
            const newUser = {
                username: "a",
                email: "test@example.com",
                password: "password123",
                weight: 70,
                age: 25,
                height: 170
            };

            await expect(UserModel.register(newUser)).rejects.toThrow("Your username must be atleast 2 characters.");
        });

        test("should throw error when username already exists", async () => {
            const newUser = {
                username: "existingUser",
                email: "test@example.com",
                password: "password123",
                weight: 70,
                age: 25,
                height: 170
            };

            mockCollection.findOne.mockResolvedValueOnce({ username: "existingUser" });

            await expect(UserModel.register(newUser)).rejects.toThrow("This username has already been used, please use another username.");
        });

        test("should throw error when email is empty", async () => {
            const newUser = {
                username: "validuser",
                email: "",
                password: "password123",
                weight: 70,
                age: 25,
                height: 170
            };

            await expect(UserModel.register(newUser)).rejects.toThrow("Please input your email");
        });

        test("should throw error when email already exists", async () => {
            const newUser = {
                username: "validuser",
                email: "existing@example.com",
                password: "password123",
                weight: 70,
                age: 25,
                height: 170
            };

            // First findOne call (username check) returns null = username is unique
            mockCollection.findOne.mockResolvedValueOnce(null);
            // Second findOne call (email check) returns a user = email already exists
            mockCollection.findOne.mockResolvedValueOnce({ email: "existing@example.com" });

            await expect(UserModel.register(newUser)).rejects.toThrow("This email has already been used, please use another email.");
        });

        test("should throw error when email format is invalid", async () => {
            const newUser = {
                username: "validuser",
                email: "invalidemail",
                password: "password123",
                weight: 70,
                age: 25,
                height: 170
            };

            // Both username and email checks pass (return null)
            mockCollection.findOne.mockResolvedValue(null);

            await expect(UserModel.register(newUser)).rejects.toThrow("Please use correct email format");
        });

        test("should throw error when password is empty", async () => {
            const newUser = {
                username: "validuser",
                email: "test@example.com",
                password: "",
                weight: 70,
                age: 25,
                height: 170
            };

            // Both username and email checks pass
            mockCollection.findOne.mockResolvedValue(null);

            await expect(UserModel.register(newUser)).rejects.toThrow("Please input your password");
        });

        test("should throw error when password is too short", async () => {
            const newUser = {
                username: "validuser",
                email: "test@example.com",
                password: "pass", // Less than 5 characters
                weight: 70,
                age: 25,
                height: 170
            };

            // Both username and email checks pass
            mockCollection.findOne.mockResolvedValue(null);

            await expect(UserModel.register(newUser)).rejects.toThrow("Your password must be at least 5 characters");
        });
    });

    describe("login method", () => {
        test("should throw error when email is empty", async () => {
            await expect(UserModel.login("", "password123")).rejects.toThrow("Please input your registered email");
        });

        test("should throw error when email format is invalid", async () => {
            await expect(UserModel.login("invalidemail", "password123")).rejects.toThrow("Please use correct email format");
        });

        test("should throw error when email is not found", async () => {
            mockCollection.findOne.mockResolvedValueOnce(null);

            await expect(UserModel.login("notfound@example.com", "password123")).rejects.toThrow("Email or Password is incorrect");
        });

        test("should throw error when password is empty", async () => {
            mockCollection.findOne.mockResolvedValueOnce({ email: "test@example.com" });

            await expect(UserModel.login("test@example.com", "")).rejects.toThrow("Please input the password");
        });

        test("should throw error when password is too short", async () => {
            mockCollection.findOne.mockResolvedValueOnce({ email: "test@example.com" });

            await expect(UserModel.login("test@example.com", "pass")).rejects.toThrow("Password must be at least 5 characters");
        });

        test("should throw error when password is incorrect", async () => {
            mockCollection.findOne.mockResolvedValueOnce({
                email: "test@example.com",
                password: "hashedPassword"
            });

            const { comparePassword } = require("../helpers/bcrypt");
            comparePassword.mockReturnValueOnce(false);

            await expect(UserModel.login("test@example.com", "wrongpassword")).rejects.toThrow("Email or Password is incorrect");
        });
    });

    describe("userDetails method", () => {
        test("should throw error when user is not found", async () => {
            mockCollection.findOne.mockResolvedValueOnce(null);

            await expect(UserModel.userDetails({ _id: "507f1f77bcf86cd799439011" })).rejects.toThrow("User not found");
        });
    });

    describe("checkUser method", () => {
        test("should throw error when username already exists", async () => {
            mockCollection.findOne.mockResolvedValueOnce({ username: "existingUser" });

            await expect(UserModel.checkUser("existingUser", "test@example.com")).rejects.toThrow("This username has already been used, please use another username.");
        });

        test("should throw error when email already exists", async () => {
            mockCollection.findOne.mockResolvedValueOnce({ email: "existing@example.com" });

            await expect(UserModel.checkUser("validuser", "existing@example.com")).rejects.toThrow("This email has already been used, please use another email.");
        });
    });
});

describe("userSchema Resolvers Error Tests", () => {
    describe("Query.checkUser", () => {
        test("should return error when username or email exists", async () => {
            // Mock the UserModel.checkUser to throw an error
            jest.spyOn(UserModel, "checkUser").mockImplementation(() => {
                throw new Error("Username or email already exists.");
            });

            const result = await userResolvers.Query.checkUser(null, { username: "existingUser", email: "existing@example.com" });

            expect(result.success).toBe(false);
            expect(result.message).toBe("Username or email already exists.");
        });

        test("should handle unexpected errors", async () => {
            // Mock the UserModel.checkUser to throw an unexpected error
            jest.spyOn(UserModel, "checkUser").mockImplementation(() => {
                throw new Error("Unexpected database error");
            });

            const result = await userResolvers.Query.checkUser(null, { username: "testuser", email: "test@example.com" });

            expect(result.success).toBe(false);
            expect(result.message).toBe("Unexpected database error");
        });
    });

    describe("Query.getUserDetails", () => {
        test("should throw error when authentication fails", async () => {
            const mockContext = {
                authentication: jest.fn().mockImplementation(() => {
                    throw new Error("Authentication failed");
                })
            };

            await expect(userResolvers.Query.getUserDetails(null, {}, mockContext)).rejects.toThrow("Authentication failed");
        });

        test("should throw error when user details cannot be fetched", async () => {
            const mockContext = {
                authentication: jest.fn().mockResolvedValue({ _id: "123" })
            };

            jest.spyOn(UserModel, "userDetails").mockImplementation(() => {
                throw new Error("User details not found");
            });

            await expect(userResolvers.Query.getUserDetails(null, {}, mockContext)).rejects.toThrow("User details not found");
        });
    });

    describe("Mutation.register", () => {
        test("should throw error when registration fails", async () => {
            jest.spyOn(UserModel, "register").mockImplementation(() => {
                throw new Error("Registration failed");
            });

            await expect(userResolvers.Mutation.register(null, {
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            })).rejects.toThrow("Registration failed");
        });
    });

    describe("Mutation.login", () => {
        test("should throw error when login fails", async () => {
            jest.spyOn(UserModel, "login").mockImplementation(() => {
                throw new Error("Invalid credentials");
            });

            await expect(userResolvers.Mutation.login(null, {
                email: "test@example.com",
                password: "password123"
            })).rejects.toThrow("Invalid credentials");
        });
    });
});