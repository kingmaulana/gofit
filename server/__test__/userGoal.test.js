const UserGoalModel = require("../models/userGoalModel");
const { userGoalResolvers } = require("../schemas/userGoalSchema");
const { ObjectId } = require('mongodb');

// Mock dependencies
jest.mock("../config/mongodb", () => ({
    database: {
        collection: jest.fn(() => ({
            find: jest.fn(() => ({
                toArray: jest.fn(),
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis()
            })),
            findOne: jest.fn(),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            aggregate: jest.fn(() => ({
                toArray: jest.fn()
            }))
        }))
    }
}));

// Mock the chatSession from AIModal
jest.mock("../service/AIModal", () => ({
    chatSession: {
        sendMessage: jest.fn(() => ({
            response: {
                text: jest.fn(() => Promise.resolve(JSON.stringify({
                    duration: 120,
                    exercises: ["Exercise1", "Exercise2", "Exercise3"]
                })))
            }
        }))
    }
}));

// Mock the analyticChat from AIAnalytic
jest.mock("../service/AIAnalytic", () => ({
    analyticChat: {
        sendMessage: jest.fn(() => ({
            response: {
                text: jest.fn(() => Promise.resolve(JSON.stringify({
                    description: "Test description",
                    exercises: ["Exercise1", "Exercise2", "Exercise3"]
                })))
            }
        }))
    }
}));

// Mock the data_exercise.json constant
jest.mock('../constant/data_exercise.json', () => [
    { id: 1, name: 'Exercise 1' },
    { id: 2, name: 'Exercise 2' }
], { virtual: true });

describe("UserGoalModel Tests", () => {
    let mockCollection;
    let mockProgressCollection;
    const mockObjectId = new ObjectId("60d21b4667d0d8992e610c85");
    const mockUserId = "60d21b4667d0d8992e610c85";

    beforeEach(() => {
        // Reset mock implementations
        jest.clearAllMocks();

        // Setup mock collections
        mockCollection = {
            find: jest.fn().mockReturnValue({
                toArray: jest.fn(),
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis()
            }),
            findOne: jest.fn(),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            aggregate: jest.fn(() => ({
                toArray: jest.fn()
            }))
        };

        mockProgressCollection = {
            find: jest.fn().mockReturnValue({
                toArray: jest.fn(),
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis()
            }),
            findOne: jest.fn(),
            insertOne: jest.fn()
        };

        // Configure different mocks for different collection calls
        const { database } = require("../config/mongodb");
        database.collection.mockImplementation(collectionName => {
            if (collectionName === "user_goal") {
                return mockCollection;
            } else if (collectionName === "weight_progress") {
                return mockProgressCollection;
            }
            return mockCollection; // Default
        });

        // Mock Date
        // Mock Date with Date.now implementation
        jest.spyOn(global, 'Date').mockImplementation(() => ({
            toISOString: () => '2023-01-01T00:00:00.000Z'
        }));
        // Mock Date.now separately
        Date.now = jest.fn(() => 1672531200000); // 2023-01-01 timestamp
    });

    afterEach(() => {
        // Restore Date
        jest.restoreAllMocks();
    });

    describe("collection method", () => {
        test("should return the user_goal collection", () => {
            const mockDb = require("../config/mongodb").database;
            
            UserGoalModel.collection();
            
            expect(mockDb.collection).toHaveBeenCalledWith("user_goal");
        });
    });

    describe("collectionProgress method", () => {
        test("should return the weight_progress collection", () => {
            const mockDb = require("../config/mongodb").database;
            
            UserGoalModel.collectionProgress();
            
            expect(mockDb.collection).toHaveBeenCalledWith("weight_progress");
        });
    });

    describe("findGoal method", () => {
        test("should return a user goal with complete exercise details", async () => {
            const mockGoal = {
                _id: mockObjectId,
                goalName: "Weight Loss",
                userId: mockObjectId,
                startWeight: 80,
                goalWeight: 70,
                completeExercise: []
            };

            const mockAggregateResult = [mockGoal];
            const mockToArray = jest.fn().mockResolvedValue(mockAggregateResult);
            mockCollection.aggregate.mockReturnValue({ toArray: mockToArray });

            const result = await UserGoalModel.findGoal({ userId: mockUserId });

            expect(mockCollection.aggregate).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({
                    $match: expect.any(Object)
                }),
                expect.objectContaining({
                    $lookup: expect.any(Object)
                })
            ]));
            expect(result).toEqual(mockGoal);
        });

        test("should handle empty result from findGoal", async () => {
            const mockToArray = jest.fn().mockResolvedValue([]);
            mockCollection.aggregate.mockReturnValue({ toArray: mockToArray });

            const result = await UserGoalModel.findGoal({ userId: mockUserId });

            expect(mockCollection.aggregate).toHaveBeenCalled();
            expect(result).toBeUndefined();
        });

        test("should throw an error when aggregate operation fails", async () => {
            const errorMessage = "Aggregation failed";
            const mockToArray = jest.fn().mockRejectedValue(new Error(errorMessage));
            mockCollection.aggregate.mockReturnValue({ toArray: mockToArray });

            await expect(UserGoalModel.findGoal({ userId: mockUserId })).rejects.toThrow();
        });
    });

    describe("createGoal method", () => {
        test("should create a user goal successfully", async () => {
            const mockArgs = {
                goalName: "Weight Loss",
                userId: mockUserId,
                startWeight: 80,
                goalWeight: 70,
                startDate: "2023-01-01",
                endGoal: "2023-12-31"
            };

            const mockInsertResult = {
                acknowledged: true,
                insertedId: mockObjectId
            };
            
            mockCollection.insertOne.mockResolvedValue(mockInsertResult);

            const result = await UserGoalModel.createGoal(mockArgs);

            expect(mockCollection.insertOne).toHaveBeenCalledWith({
                goalName: mockArgs.goalName,
                userId: mockArgs.userId,
                startWeight: mockArgs.startWeight,
                goalWeight: mockArgs.goalWeight,
                startDate: mockArgs.startDate,
                endGoal: mockArgs.endGoal,
                exercise: []
            });
            expect(result).toEqual(mockInsertResult);
        });

        test("should throw an error when goal creation fails", async () => {
            const mockArgs = {
                goalName: "Weight Loss",
                userId: mockUserId
            };

            const errorMessage = "Failed to create goal";
            mockCollection.insertOne.mockRejectedValue(new Error(errorMessage));

            await expect(UserGoalModel.createGoal(mockArgs)).rejects.toThrow(errorMessage);
        });
    });

    describe("updateWeightProgress method", () => {
        test("should create a weight progress entry successfully", async () => {
            const mockArgs = {
                userId: mockUserId,
                weight: 75
            };

            const mockInsertResult = {
                acknowledged: true,
                insertedId: mockObjectId
            };
            
            mockProgressCollection.insertOne.mockResolvedValue(mockInsertResult);

            const result = await UserGoalModel.updateWeightProgress(mockArgs);

            expect(mockProgressCollection.insertOne).toHaveBeenCalledWith({
                userId: mockArgs.userId,
                weight: mockArgs.weight,
                date: "2023-01-01T00:00:00.000Z"
            });
            expect(result).toEqual(mockInsertResult);
        });

        test("should throw an error when weight progress update fails", async () => {
            const mockArgs = {
                userId: mockUserId,
                weight: 75
            };

            const errorMessage = "Failed to update weight progress";
            mockProgressCollection.insertOne.mockRejectedValue(new Error(errorMessage));

            await expect(UserGoalModel.updateWeightProgress(mockArgs)).rejects.toThrow(errorMessage);
        });
    });

    describe("createSuggestionAI method", () => {
        test("should create AI exercise suggestions successfully", async () => {
            const mockArgs = {
                userId: mockUserId,
                goalName: "Weight Loss",
                weight: 80,
                goalWeight: 70,
                gender: "male",
                activity: "moderate"
            };

            const mockUserGoal = {
                _id: mockObjectId,
                goalName: "Weight Loss",
                userId: mockObjectId,
                startWeight: 80,
                goalWeight: 70
            };

            // Mock findOne to return a goal
            mockCollection.findOne.mockResolvedValue(mockUserGoal);

            // Mock updateOne to succeed
            mockCollection.updateOne.mockResolvedValue({ acknowledged: true, modifiedCount: 1 });

            // Mock the AI response (already done in the jest.mock section)
            const { chatSession } = require("../service/AIModal");

            const result = await UserGoalModel.createSuggestionAI(mockArgs);

            // Verify findOne was called
            expect(mockCollection.findOne).toHaveBeenCalledWith({
                userId: new ObjectId(mockArgs.userId)
            });

            // Verify chatSession.sendMessage was called
            expect(chatSession.sendMessage).toHaveBeenCalled();

            // Verify updateOne was called with the correct exercise data
            expect(mockCollection.updateOne).toHaveBeenCalledWith(
                { userId: new ObjectId(mockArgs.userId) },
                { $set: { exercise: { exercise: ["Exercise1", "Exercise2", "Exercise3"], duration: 120 } } }
            );

            // Verify the result
            expect(result).toEqual({ success: true, message: "Exercises updated successfully" });
        });

        test("should throw an error when user goal is not found", async () => {
            const mockArgs = {
                userId: mockUserId
            };

            // Mock findOne to return null (no goal found)
            mockCollection.findOne.mockResolvedValue(null);

            await expect(UserGoalModel.createSuggestionAI(mockArgs))
                .rejects.toThrow('No goal found for the user');
        });

        test("should throw an error when AI response is invalid", async () => {
            const mockArgs = {
                userId: mockUserId
            };

            const mockUserGoal = {
                _id: mockObjectId,
                userId: mockObjectId
            };

            // Mock findOne to return a goal
            mockCollection.findOne.mockResolvedValue(mockUserGoal);

            // Mock an invalid AI response
            const { chatSession } = require("../service/AIModal");
            chatSession.sendMessage.mockImplementationOnce(() => ({
                response: {
                    text: jest.fn(() => Promise.resolve('{"invalid": "response"}'))
                }
            }));

            await expect(UserGoalModel.createSuggestionAI(mockArgs))
                .rejects.toThrow("Invalid response format. 'duration' and 'exercise' are required.");
        });

        test("should handle API errors properly", async () => {
            const mockArgs = {
                userId: mockUserId
            };

            const mockUserGoal = {
                _id: mockObjectId,
                userId: mockObjectId
            };

            // Mock findOne to return a goal
            mockCollection.findOne.mockResolvedValue(mockUserGoal);

            // Mock an error in the AI API call
            const errorMessage = "AI API Error";
            const { chatSession } = require("../service/AIModal");
            chatSession.sendMessage.mockImplementationOnce(() => {
                throw new Error(errorMessage);
            });

            await expect(UserGoalModel.createSuggestionAI(mockArgs)).rejects.toThrow();
        });
    });

    describe("giveAnalyticByAI method", () => {
        test("should generate analytics when current weight is not goal weight", async () => {
            const mockArgs = {
                userId: mockUserId
            };

            const mockUserGoal = {
                _id: mockObjectId,
                goalName: "Weight Loss",
                userId: new ObjectId(mockUserId),
                startWeight: 80,
                goalWeight: 70,
                startDate: "2023-01-01"
            };

            const mockLatestLog = {
                _id: mockObjectId, // Use existing ObjectId instead of creating a new one
                userId: mockUserId,
                weight: 75,
                date: "2023-01-15T00:00:00.000Z"
            };

            // Mock findOne to return a user goal
            mockCollection.findOne.mockResolvedValue(mockUserGoal);

            // Mock find to return latest logs
            const mockToArray = jest.fn().mockResolvedValue([mockLatestLog]);
            mockProgressCollection.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                toArray: mockToArray
            });

            // Mock analyticChat
            const { analyticChat } = require("../service/AIAnalytic");

            const result = await UserGoalModel.giveAnalyticByAI(mockArgs);

            // Verify findOne was called
            expect(mockCollection.findOne).toHaveBeenCalledWith({
                userId: new ObjectId(mockArgs.userId)
            });

            // Verify find was called for latest logs
            expect(mockProgressCollection.find).toHaveBeenCalledWith({
                userId: mockArgs.userId
            });
            expect(mockProgressCollection.find().sort).toHaveBeenCalledWith({ date: -1 });
            expect(mockProgressCollection.find().sort().limit).toHaveBeenCalledWith(1);

            // Verify analyticChat.sendMessage was called
            expect(analyticChat.sendMessage).toHaveBeenCalled();
        });

        test("should generate analytics when current weight equals goal weight", async () => {
            const mockArgs = {
                userId: mockUserId
            };

            const mockUserGoal = {
                _id: mockObjectId,
                goalName: "Weight Maintenance",
                userId: new ObjectId(mockUserId),
                startWeight: 70,
                goalWeight: 70,
                startDate: "2023-01-01"
            };

            const mockLatestLog = {
                _id: mockObjectId, // Use existing ObjectId instead of creating a new one
                userId: mockUserId,
                weight: 70, // Same as goal weight
                date: "2023-01-15T00:00:00.000Z"
            };

            // Mock findOne to return a user goal
            mockCollection.findOne.mockResolvedValue(mockUserGoal);

            // Mock find to return latest logs
            const mockToArray = jest.fn().mockResolvedValue([mockLatestLog]);
            mockProgressCollection.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                toArray: mockToArray
            });

            // Mock analyticChat
            const { analyticChat } = require("../service/AIAnalytic");

            await UserGoalModel.giveAnalyticByAI(mockArgs);

            // Verify findOne was called
            expect(mockCollection.findOne).toHaveBeenCalledWith({
                userId: new ObjectId(mockArgs.userId)
            });

            // Verify find was called for latest logs
            expect(mockProgressCollection.find).toHaveBeenCalledWith({
                userId: mockArgs.userId
            });

            // Verify analyticChat.sendMessage was called with the "goal reached" message
            expect(analyticChat.sendMessage).toHaveBeenCalledWith(expect.stringContaining("The user already have a fit and reach the goal"));
        });

        test("should handle errors in giveAnalyticByAI method", async () => {
            const mockArgs = {
                userId: mockUserId
            };

            // Mock findOne to throw an error
            const errorMessage = "Database error";
            mockCollection.findOne.mockRejectedValue(new Error(errorMessage));

            // Spy on console.log to verify error logging
            const consoleSpy = jest.spyOn(console, 'log');

            await UserGoalModel.giveAnalyticByAI(mockArgs);

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining("giveAnalyticByAI ~ error"),
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });
    });

    describe("getWeightProgress method", () => {
        test("should successfully retrieve weight progress", async () => {
            const mockArgs = {
                userId: mockUserId
            };

            const mockProgressData = [
                {
                    _id: mockObjectId, // Use existing ObjectId instead of creating a new one
                    userId: mockUserId,
                    weight: 80,
                    date: "2023-01-01T00:00:00.000Z"
                },
                {
                    _id: mockObjectId, // Use existing ObjectId instead of creating a new one
                    userId: mockUserId,
                    weight: 78,
                    date: "2023-01-15T00:00:00.000Z"
                }
            ];

            // Mock find to return progress data
            const mockToArray = jest.fn().mockResolvedValue(mockProgressData);
            mockProgressCollection.find.mockReturnValue({
                toArray: mockToArray
            });

            const result = await UserGoalModel.getWeightProgress(mockArgs);

            // Verify find was called
            expect(mockProgressCollection.find).toHaveBeenCalledWith({
                userId: mockArgs.userId
            });

            // Verify result
            expect(result).toEqual(mockProgressData);
        });

        test("should handle errors in getWeightProgress method", async () => {
            const mockArgs = {
                userId: mockUserId
            };

            // Mock find to throw an error
            const errorMessage = "Database error";
            mockProgressCollection.find.mockImplementation(() => {
                throw new Error(errorMessage);
            });

            // Spy on console.log to verify error logging
            const consoleSpy = jest.spyOn(console, 'log');

            const result = await UserGoalModel.getWeightProgress(mockArgs);

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining("getWeightProgress ~ error"),
                expect.any(Error)
            );

            // Verify result is undefined (function doesn't return anything on error)
            expect(result).toBeUndefined();

            consoleSpy.mockRestore();
        });
    });
});

// Tests for userGoalSchema resolvers
describe("UserGoalSchema Resolver Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Query Resolvers", () => {
        test("userGoals should return user goals successfully", async () => {
            const mockArgs = { userId: "60d21b4667d0d8992e610c85" };
            const mockResult = {
                _id: "60d21b4667d0d8992e610c85",
                goalName: "Weight Loss",
                userId: "60d21b4667d0d8992e610c85",
                startWeight: 80,
                goalWeight: 70
            };

            // Mock the UserGoalModel.findGoal method
            jest.spyOn(UserGoalModel, 'findGoal').mockResolvedValue(mockResult);

            // Call the resolver
            const result = await userGoalResolvers.Query.userGoals(null, mockArgs);

            // Verify UserGoalModel.findGoal was called with the correct arguments
            expect(UserGoalModel.findGoal).toHaveBeenCalledWith(mockArgs);

            // Verify the result
            expect(result).toEqual(mockResult);
        });

        test("userGoals should handle errors", async () => {
            const mockArgs = { userId: "60d21b4667d0d8992e610c85" };
            const errorMessage = "Failed to fetch user goals";

            // Mock the UserGoalModel.findGoal method to throw an error
            jest.spyOn(UserGoalModel, 'findGoal').mockRejectedValue(new Error(errorMessage));

            // Call the resolver and expect it to throw
            await expect(userGoalResolvers.Query.userGoals(null, mockArgs))
                .rejects.toThrow(errorMessage);
        });

        test("getWeightProgress should return weight progress successfully", async () => {
            const mockArgs = { userId: "60d21b4667d0d8992e610c85" };
            const mockResult = [
                {
                    _id: "60d21b4667d0d8992e610c85",
                    userId: "60d21b4667d0d8992e610c85",
                    weight: 78,
                    date: "2023-01-15T00:00:00.000Z"
                }
            ];

            // Mock the UserGoalModel.getWeightProgress method
            jest.spyOn(UserGoalModel, 'getWeightProgress').mockResolvedValue(mockResult);

            // Call the resolver
            const result = await userGoalResolvers.Query.getWeightProgress(null, mockArgs);

            // Verify UserGoalModel.getWeightProgress was called with the correct arguments
            expect(UserGoalModel.getWeightProgress).toHaveBeenCalledWith(mockArgs);

            // Verify the result
            expect(result).toEqual(mockResult);
        });

        test("getWeightProgress should handle errors", async () => {
            const mockArgs = { userId: "60d21b4667d0d8992e610c85" };
            const errorMessage = "Failed to fetch weight progress";

            // Mock the UserGoalModel.getWeightProgress method to throw an error
            jest.spyOn(UserGoalModel, 'getWeightProgress').mockRejectedValue(new Error(errorMessage));

            // Call the resolver and expect it to throw
            await expect(userGoalResolvers.Query.getWeightProgress(null, mockArgs))
                .rejects.toThrow(errorMessage);
        });
    });

    describe("Mutation Resolvers", () => {
        test("createUserGoal should create a user goal successfully", async () => {
            const mockArgs = {
                goalName: "Weight Loss",
                userId: "60d21b4667d0d8992e610c85",
                startWeight: 80,
                goalWeight: 70,
                startDate: "2023-01-01",
                endGoal: "2023-12-31"
            };

            const mockResult = {
                acknowledged: true,
                insertedId: "60d21b4667d0d8992e610c85"
            };

            // Mock the UserGoalModel.createGoal method
            jest.spyOn(UserGoalModel, 'createGoal').mockResolvedValue(mockResult);

            // Call the resolver
            const result = await userGoalResolvers.Mutation.createUserGoal(null, mockArgs);

            // Verify UserGoalModel.createGoal was called with the correct arguments
            expect(UserGoalModel.createGoal).toHaveBeenCalledWith(mockArgs);

            // Verify the result
            expect(result).toEqual(mockResult);
        });

        test("createUserGoal should handle errors", async () => {
            const mockArgs = {
                goalName: "Weight Loss",
                userId: "60d21b4667d0d8992e610c85"
            };

            const errorMessage = "Failed to create user goal";

            // Mock the UserGoalModel.createGoal method to throw an error
            jest.spyOn(UserGoalModel, 'createGoal').mockRejectedValue(new Error(errorMessage));

            // Call the resolver and expect it to throw
            await expect(userGoalResolvers.Mutation.createUserGoal(null, mockArgs))
                .rejects.toThrow(errorMessage);
        });

        test("updateWeightProgress should update weight progress successfully", async () => {
            const mockArgs = {
                userId: "60d21b4667d0d8992e610c85",
                weight: 75
            };

            const mockResult = {
                acknowledged: true,
                insertedId: "60d21b4667d0d8992e610c85"
            };

            // Mock the UserGoalModel.updateWeightProgress method
            jest.spyOn(UserGoalModel, 'updateWeightProgress').mockResolvedValue(mockResult);

            // Call the resolver
            const result = await userGoalResolvers.Mutation.updateWeightProgress(null, mockArgs);

            // Verify UserGoalModel.updateWeightProgress was called with the correct arguments
            expect(UserGoalModel.updateWeightProgress).toHaveBeenCalledWith(mockArgs);

            // Verify the result
            expect(result).toEqual(mockResult);
        });

        test("updateWeightProgress should handle errors", async () => {
            const mockArgs = {
                userId: "60d21b4667d0d8992e610c85",
                weight: 75
            };

            const errorMessage = "Failed to update weight progress";

            // Mock the UserGoalModel.updateWeightProgress method to throw an error
            jest.spyOn(UserGoalModel, 'updateWeightProgress').mockRejectedValue(new Error(errorMessage));

            // Call the resolver and expect it to throw
            await expect(userGoalResolvers.Mutation.updateWeightProgress(null, mockArgs))
                .rejects.toThrow(errorMessage);
        });

        test("createSuggestionAI should create AI suggestions successfully", async () => {
            const mockArgs = {
                userId: "60d21b4667d0d8992e610c85",
                goalName: "Weight Loss",
                weight: 80,
                goalWeight: 70
            };

            const mockResult = {
                success: true,
                message: "Exercises updated successfully"
            };

            // Mock the UserGoalModel.createSuggestionAI method
            jest.spyOn(UserGoalModel, 'createSuggestionAI').mockResolvedValue(mockResult);

            // Call the resolver
            const result = await userGoalResolvers.Mutation.createSuggestionAI(null, mockArgs);

            // Verify UserGoalModel.createSuggestionAI was called with the correct arguments
            expect(UserGoalModel.createSuggestionAI).toHaveBeenCalledWith(mockArgs);

            // Verify the result
            expect(result).toEqual(mockResult);
        });

        test("createSuggestionAI should handle errors", async () => {
            const mockArgs = {
                userId: "60d21b4667d0d8992e610c85",
                goalName: "Weight Loss",
                weight: 80,
                goalWeight: 70
            };

            const errorMessage = "Failed to create AI suggestions";

            // Mock the UserGoalModel.createSuggestionAI method to throw an error
            jest.spyOn(UserGoalModel, 'createSuggestionAI').mockRejectedValue(new Error(errorMessage));

            // Call the resolver and expect it to throw
            await expect(userGoalResolvers.Mutation.createSuggestionAI(null, mockArgs))
                .rejects.toThrow(errorMessage);
        });

        test("giveAnalyticByAI should generate analytics successfully", async () => {
            const mockArgs = {
                userId: "60d21b4667d0d8992e610c85"
            };

            const mockResult = {
                description: "Test description",
                exercises: ["Exercise1", "Exercise2", "Exercise3"]
            };

            // Mock the UserGoalModel.giveAnalyticByAI method
            jest.spyOn(UserGoalModel, 'giveAnalyticByAI').mockResolvedValue(mockResult);

            // Call the resolver
            const result = await userGoalResolvers.Mutation.giveAnalyticByAI(null, mockArgs);

            // Verify UserGoalModel.giveAnalyticByAI was called with the correct arguments
            expect(UserGoalModel.giveAnalyticByAI).toHaveBeenCalledWith(mockArgs);

            // Verify the result
            expect(result).toEqual(mockResult);
        });

        test("giveAnalyticByAI should handle errors", async () => {
            const mockArgs = {
                userId: "60d21b4667d0d8992e610c85"
            };

            const errorMessage = "Failed to generate analytics";

            // Mock the UserGoalModel.giveAnalyticByAI method to throw an error
            jest.spyOn(UserGoalModel, 'giveAnalyticByAI').mockRejectedValue(new Error(errorMessage));

            // Call the resolver and expect it to throw
            await expect(userGoalResolvers.Mutation.giveAnalyticByAI(null, mockArgs))
                .rejects.toThrow(errorMessage);
        });
    });
});
