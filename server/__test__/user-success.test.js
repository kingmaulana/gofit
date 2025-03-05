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
    comparePassword: jest.fn(() => true) // Default to true for success paths
}));

jest.mock("../helpers/jwt", () => ({
    signToken: jest.fn(() => "test-token"),
    verifyToken: jest.fn()
}));

jest.mock("../models/userGoalModel", () => ({
    createGoal: jest.fn(() => Promise.resolve()),
    createSuggestionAI: jest.fn(() => Promise.resolve())
}));

describe("UserModel Success Tests", () => {
    let mockCollection;
    const mockObjectId = new ObjectId("60d21b4667d0d8992e610c85");

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

    describe("collectionGoal method", () => {
        test("should return the user_goal collection", () => {
            const mockDb = require("../config/mongodb").database;
            
            UserModel.collectionGoal();
            
            expect(mockDb.collection).toHaveBeenCalledWith("user_goal");
        });
    });

    describe("register method success path", () => {
        test("should successfully register a new user", async () => {
            const newUser = {
                username: "newuser",
                email: "newuser@example.com",
                password: "password123",
                weight: 70,
                age: 25,
                height: 170,
                goal: "lose weight",
                activity: "moderate",
                endGoal: "healthy lifestyle",
                bmi: 24,
                goalWeight: 65
            };

            // Mock findOne to return null (username and email are unique)
            mockCollection.findOne.mockResolvedValue(null);
            
            // Mock insertOne to return a successful result
            mockCollection.insertOne.mockResolvedValue({ 
                insertedId: mockObjectId
            });

            const result = await UserModel.register(newUser);

            // Verify the correct function calls
            expect(mockCollection.findOne).toHaveBeenCalledTimes(2); // Check for username and email
            expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
            expect(require("../helpers/bcrypt").hashPassword).toHaveBeenCalledWith(newUser.password);
            expect(require("../models/userGoalModel").createGoal).toHaveBeenCalled();
            expect(require("../models/userGoalModel").createSuggestionAI).toHaveBeenCalled();
            expect(require("../helpers/jwt").signToken).toHaveBeenCalledWith({ _id: mockObjectId });
            
            // Verify return value
            expect(result).toEqual({ access_token: "test-token" });
        });
    });

    describe("userDetails method success path", () => {
        test("should return user details successfully", async () => {
            const mockUser = {
                _id: mockObjectId,
                username: "testuser",
                email: "test@example.com",
                age: 25,
                height: 170,
                weight: 70,
                createdAt: new Date("2023-01-01"),
                updatedAt: new Date("2023-01-01")
            };

            mockCollection.findOne.mockResolvedValue(mockUser);

            const result = await UserModel.userDetails({ _id: mockObjectId.toString() });

            expect(mockCollection.findOne).toHaveBeenCalledWith({
                _id: expect.any(ObjectId)
            });
            
            expect(result).toEqual({
                _id: mockObjectId,
                username: "testuser",
                email: "test@example.com",
                age: 25,
                height: 170,
                weight: 70,
                createdAt: mockUser.createdAt,
                updatedAt: mockUser.updatedAt
            });
        });
    });

    describe("login method success path", () => {
        test("should login user successfully and return token", async () => {
            const mockUser = {
                _id: mockObjectId,
                email: "test@example.com",
                username: "testuser",
                password: "hashedPassword"
            };

            mockCollection.findOne.mockResolvedValue(mockUser);

            const result = await UserModel.login("test@example.com", "password123");

            expect(mockCollection.findOne).toHaveBeenCalledWith({
                email: "test@example.com"
            });
            expect(require("../helpers/bcrypt").comparePassword).toHaveBeenCalledWith("password123", "hashedPassword");
            expect(require("../helpers/jwt").signToken).toHaveBeenCalledWith({
                _id: mockObjectId,
                email: "test@example.com",
                username: "testuser"
            });
            
            expect(result).toEqual({ access_token: "test-token" });
        });
    });

    describe("checkUser method success path", () => {
        test("should return false when username and email are unique", async () => {
            // Mock findOne to return null (username and email not found)
            mockCollection.findOne.mockResolvedValue(null);

            const result = await UserModel.checkUser("newuser", "new@example.com");

            expect(mockCollection.findOne).toHaveBeenCalledWith({
                $or: [{ username: "newuser" }, { email: "new@example.com" }]
            });
            
            expect(result).toBe(false);
        });
    });
});

describe("userSchema Resolvers Success Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Query.checkUser", () => {
        test("should return success true when username and email are available", async () => {
            // Mock UserModel.checkUser to return false (indicating username/email are available)
            jest.spyOn(UserModel, "checkUser").mockResolvedValue(false);

            const result = await userResolvers.Query.checkUser(null, { 
                username: "availableuser", 
                email: "available@example.com" 
            });

            expect(result.success).toBe(true);
            expect(result.message).toBe("Username and email are available, please continue.");
        });

        test("should return success false when userExists is true", async () => {
            // Mock UserModel.checkUser to return true (indicating username/email exist)
            jest.spyOn(UserModel, "checkUser").mockResolvedValue(true);

            const result = await userResolvers.Query.checkUser(null, { 
                username: "existinguser", 
                email: "existing@example.com" 
            });

            expect(result.success).toBe(false);
            expect(result.message).toBe("Username or email already exists.");
        });
    });

    describe("Query.getUserDetails", () => {
        test("should return user details when authentication succeeds", async () => {
            const mockUserDetails = {
                _id: "60d21b4667d0d8992e610c85",
                username: "testuser",
                email: "test@example.com",
                weight: 70,
                height: 170,
                age: 25
            };

            const mockContext = {
                authentication: jest.fn().mockResolvedValue({ _id: "60d21b4667d0d8992e610c85" })
            };

            jest.spyOn(UserModel, "userDetails").mockResolvedValue(mockUserDetails);

            const result = await userResolvers.Query.getUserDetails(null, {}, mockContext);

            expect(mockContext.authentication).toHaveBeenCalled();
            expect(UserModel.userDetails).toHaveBeenCalledWith({ _id: "60d21b4667d0d8992e610c85" });
            expect(result).toEqual(mockUserDetails);
        });
    });

    describe("Mutation.register", () => {
        test("should successfully register a user and return token", async () => {
            const mockUser = {
                username: "newuser",
                email: "new@example.com",
                password: "password123",
                weight: 70,
                height: 170,
                age: 25,
                gender: "male",
                activity: "moderate",
                goal: "lose weight",
                bmi: 24,
                goalWeight: 65,
                endGoal: "healthy lifestyle",
                injuries: ["none"]
            };

            // Mock UserModel.register to return a token
            jest.spyOn(UserModel, "register").mockResolvedValue({ 
                access_token: "test-token" 
            });

            const result = await userResolvers.Mutation.register(null, mockUser);

            expect(UserModel.register).toHaveBeenCalledWith({
                username: mockUser.username,
                name: mockUser.name,
                email: mockUser.email,
                password: mockUser.password,
                weight: mockUser.weight,
                age: mockUser.age,
                height: mockUser.height,
                gender: mockUser.gender,
                activity: mockUser.activity,
                goal: mockUser.goal,
                bmi: mockUser.bmi,
                goalWeight: mockUser.goalWeight,
                endGoal: mockUser.endGoal,
                injuries: mockUser.injuries
            });
            
            expect(result).toEqual({ access_token: "test-token" });
        });
    });

    describe("Mutation.login", () => {
        test("should successfully login a user and return token", async () => {
            // Mock UserModel.login to return a token
            jest.spyOn(UserModel, "login").mockResolvedValue({ 
                access_token: "test-token" 
            });

            const result = await userResolvers.Mutation.login(null, { 
                email: "test@example.com", 
                password: "password123" 
            });

            expect(UserModel.login).toHaveBeenCalledWith("test@example.com", "password123");
            expect(result).toEqual({ access_token: "test-token" });
        });
    });
});

