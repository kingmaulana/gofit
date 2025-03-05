const WorkoutModel = require("../models/workoutModel");
const { workoutResolvers } = require("../schemas/workoutSchema");
const { ObjectId } = require('mongodb');

// Mock dependencies
jest.mock("../config/mongodb", () => ({
    database: {
        collection: jest.fn(() => ({
            find: jest.fn(() => ({
                toArray: jest.fn()
            })),
            findOne: jest.fn()
        }))
    }
}));

// Mock the chatSession from AIModal
jest.mock("../service/AIModal", () => ({
    chatSession: {
        sendMessage: jest.fn(() => ({
            response: {
                text: jest.fn(() => Promise.resolve("Mocked AI response"))
            }
        }))
    }
}));

describe("WorkoutModel Tests", () => {
    let mockCollection;
    let mockCategoryCollection;
    const mockObjectId = new ObjectId("60d21b4667d0d8992e610c85");

    beforeEach(() => {
        // Reset mock implementations
        jest.clearAllMocks();

        // Setup mock collections
        mockCollection = {
            find: jest.fn().mockReturnValue({
                toArray: jest.fn()
            }),
            findOne: jest.fn()
        };

        mockCategoryCollection = {
            find: jest.fn().mockReturnValue({
                toArray: jest.fn()
            }),
            findOne: jest.fn()
        };

        // Configure different mocks for different collection calls
        const { database } = require("../config/mongodb");
        database.collection.mockImplementation(collectionName => {
            if (collectionName === "exercise") {
                return mockCollection;
            } else if (collectionName === "category_exercise") {
                return mockCategoryCollection;
            }
            return mockCollection; // Default
        });
    });

    describe("collection method", () => {
        test("should return the exercise collection", () => {
            const mockDb = require("../config/mongodb").database;
            
            WorkoutModel.collection();
            
            expect(mockDb.collection).toHaveBeenCalledWith("exercise");
        });
    });

    describe("collectionCategory method", () => {
        test("should return the category_exercise collection", () => {
            const mockDb = require("../config/mongodb").database;
            
            WorkoutModel.collectionCategory();
            
            expect(mockDb.collection).toHaveBeenCalledWith("category_exercise");
        });
    });

    describe("findAll method", () => {
        test("should return all workouts successfully", async () => {
            const mockWorkouts = [
                { _id: new ObjectId(), name: "Workout 1" },
                { _id: new ObjectId(), name: "Workout 2" }
            ];

            const mockToArray = jest.fn().mockResolvedValue(mockWorkouts);
            mockCollection.find.mockReturnValue({ toArray: mockToArray });

            const result = await WorkoutModel.findAll();

            expect(mockCollection.find).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockWorkouts);
        });

        test("should throw an error when database query fails", async () => {
            const errorMessage = "Database connection failed";
            const mockToArray = jest.fn().mockRejectedValue(new Error(errorMessage));
            mockCollection.find.mockReturnValue({ toArray: mockToArray });

            await expect(WorkoutModel.findAll()).rejects.toThrow(Error);
        });
    });

    describe("findById method", () => {
        test("should return a workout by id successfully", async () => {
            const mockWorkout = {
                _id: mockObjectId,
                name: "Bench Press",
                category: "strength",
                equipment: "barbell"
            };

            mockCollection.findOne.mockResolvedValue(mockWorkout);

            const result = await WorkoutModel.findById(mockObjectId.toString());

            expect(mockCollection.findOne).toHaveBeenCalledWith({
                _id: expect.any(ObjectId)
            });
            expect(result).toEqual(mockWorkout);
        });

        test("should call chatSession.sendMessage", async () => {
            const mockWorkout = {
                _id: mockObjectId,
                name: "Bench Press"
            };

            mockCollection.findOne.mockResolvedValue(mockWorkout);
            
            await WorkoutModel.findById(mockObjectId.toString());

            const { chatSession } = require("../service/AIModal");
            expect(chatSession.sendMessage).toHaveBeenCalledWith("Make a list of thing i do if im a monster ?");
        });

        test("should throw an error when finding workout by id fails", async () => {
            mockCollection.findOne.mockRejectedValue(new Error("Database error"));

            await expect(WorkoutModel.findById(mockObjectId.toString())).rejects.toThrow("Database error");
        });
    });

    describe("workoutByFilter method", () => {
        test("should return workouts by category filter", async () => {
            const mockWorkouts = [
                { _id: new ObjectId(), name: "Workout 1", category: "strength" },
                { _id: new ObjectId(), name: "Workout 2", category: "strength" }
            ];

            const mockToArray = jest.fn().mockResolvedValue(mockWorkouts);
            mockCollection.find.mockReturnValue({ toArray: mockToArray });

            const result = await WorkoutModel.workoutByFilter({ category: "strength" });

            expect(mockCollection.find).toHaveBeenCalledWith({ category: "strength" });
            expect(result).toEqual(mockWorkouts);
        });

        test("should return workouts by equipment filter", async () => {
            const mockWorkouts = [
                { _id: new ObjectId(), name: "Workout 1", equipment: "barbell" },
                { _id: new ObjectId(), name: "Workout 2", equipment: "barbell" }
            ];

            const mockToArray = jest.fn().mockResolvedValue(mockWorkouts);
            mockCollection.find.mockReturnValue({ toArray: mockToArray });

            const result = await WorkoutModel.workoutByFilter({ equipment: "barbell" });

            expect(mockCollection.find).toHaveBeenCalledWith({ equipment: "barbell" });
            expect(result).toEqual(mockWorkouts);
        });

        test("should return workouts by level filter", async () => {
            const mockWorkouts = [
                { _id: new ObjectId(), name: "Workout 1", level: "beginner" },
                { _id: new ObjectId(), name: "Workout 2", level: "beginner" }
            ];

            const mockToArray = jest.fn().mockResolvedValue(mockWorkouts);
            mockCollection.find.mockReturnValue({ toArray: mockToArray });

            const result = await WorkoutModel.workoutByFilter({ level: "beginner" });

            expect(mockCollection.find).toHaveBeenCalledWith({ level: "beginner" });
            expect(result).toEqual(mockWorkouts);
        });

        test("should return workouts with multiple filters", async () => {
            const mockWorkouts = [
                { 
                    _id: new ObjectId(), 
                    name: "Workout 1", 
                    category: "strength", 
                    equipment: "barbell", 
                    level: "intermediate" 
                }
            ];

            const mockToArray = jest.fn().mockResolvedValue(mockWorkouts);
            mockCollection.find.mockReturnValue({ toArray: mockToArray });

            const result = await WorkoutModel.workoutByFilter({
                category: "strength",
                equipment: "barbell",
                level: "intermediate"
            });

            expect(mockCollection.find).toHaveBeenCalledWith({
                category: "strength",
                equipment: "barbell",
                level: "intermediate"
            });
            expect(result).toEqual(mockWorkouts);
        });

        test("should throw an error when filter query fails", async () => {
            const errorMessage = "Filter error";
            const mockToArray = jest.fn().mockRejectedValue(new Error(errorMessage));
            mockCollection.find.mockReturnValue({ toArray: mockToArray });

            await expect(WorkoutModel.workoutByFilter({ category: "strength" })).rejects.toThrow(errorMessage);
        });
    });
});

describe("workoutSchema Resolvers Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Query.workouts", () => {
        test("should return all workouts successfully", async () => {
            const mockWorkouts = [
                { _id: new ObjectId(), name: "Workout 1" },
                { _id: new ObjectId(), name: "Workout 2" }
            ];

            jest.spyOn(WorkoutModel, "findAll").mockResolvedValue(mockWorkouts);

            const result = await workoutResolvers.Query.workouts();

            expect(WorkoutModel.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockWorkouts);
        });

        test("should throw an error when finding all workouts fails", async () => {
            jest.spyOn(WorkoutModel, "findAll").mockImplementation(() => {
                throw new Error("Failed to fetch workouts");
            });

            await expect(workoutResolvers.Query.workouts()).rejects.toThrow("Failed to fetch workouts");
        });
    });

    describe("Query.workoutById", () => {
        test("should return a workout by id successfully", async () => {
            const mockObjectId = new ObjectId();
            const mockWorkout = {
                _id: mockObjectId,
                name: "Bench Press",
                category: "strength"
            };

            jest.spyOn(WorkoutModel, "findById").mockResolvedValue(mockWorkout);

            const result = await workoutResolvers.Query.workoutById(null, { id: mockObjectId.toString() });

            expect(WorkoutModel.findById).toHaveBeenCalledWith(mockObjectId.toString());
            expect(result).toEqual(mockWorkout);
        });

        test("should throw an error when finding workout by id fails", async () => {
            jest.spyOn(WorkoutModel, "findById").mockImplementation(() => {
                throw new Error("Workout not found");
            });

            await expect(workoutResolvers.Query.workoutById(null, { id: "invalid-id" })).rejects.toThrow("Workout not found");
        });
    });

    describe("Query.workoutByFilter", () => {
        test("should return workouts by filter successfully", async () => {
            const mockWorkouts = [
                { _id: new ObjectId(), name: "Workout 1", category: "strength" },
                { _id: new ObjectId(), name: "Workout 2", category: "strength" }
            ];

            jest.spyOn(WorkoutModel, "workoutByFilter").mockResolvedValue(mockWorkouts);

            const result = await workoutResolvers.Query.workoutByFilter(null, { 
                category: "strength",
                equipment: "barbell"
            });

            expect(WorkoutModel.workoutByFilter).toHaveBeenCalledWith({ 
                category: "strength",
                equipment: "barbell"
            });
            expect(result).toEqual(mockWorkouts);
        });

        test("should throw an error when filtering workouts fails", async () => {
            jest.spyOn(WorkoutModel, "workoutByFilter").mockImplementation(() => {
                throw new Error("Filter operation failed");
            });

            await expect(workoutResolvers.Query.workoutByFilter(null, { category: "invalid" })).rejects.toThrow("Filter operation failed");
        });
    });
});

