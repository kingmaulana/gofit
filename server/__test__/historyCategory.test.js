const { historyExerciseResolvers } = require('../schemas/historyCategorySchema');
const HistoryExerciseModel = require('../models/historyCategoryModel');
const { ObjectId } = require('mongodb');

// Mock MongoDB
jest.mock('../config/mongodb', () => ({
    database: {
        collection: jest.fn()
    }
}));

// Mock ObjectId
jest.mock('mongodb', () => {
    const originalModule = jest.requireActual('mongodb');
    return {
        ...originalModule,
        ObjectId: {
            createFromHexString: jest.fn(id => id)
        }
    };
});

describe('HistoryExerciseModel', () => {
    let mockCollection;
    let mockFind;
    let mockSort;
    let mockToArray;
    let mockInsertOne;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Setup collection mock
        mockToArray = jest.fn();
        mockSort = jest.fn(() => ({ toArray: mockToArray }));
        mockFind = jest.fn(() => ({ sort: mockSort }));
        mockInsertOne = jest.fn();
        mockCollection = {
            find: mockFind,
            insertOne: mockInsertOne
        };

        // Setup database.collection mock
        require('../config/mongodb').database.collection.mockReturnValue(mockCollection);
    });

    describe('collection', () => {
        it('should return the history_logs_categoryExercise collection', () => {
            HistoryExerciseModel.collection();
            expect(require('../config/mongodb').database.collection).toHaveBeenCalledWith('history_logs_categoryExercise');
        });
    });

    describe('findAll', () => {
        it('should find history logs for a specific user', async () => {
            const mockUserId = '123456789012';
            const mockResult = [
                { _id: '1', userId: mockUserId, categoryId: '111', userGoalId: '222' },
                { _id: '2', userId: mockUserId, categoryId: '333', userGoalId: '444' }
            ];

            mockToArray.mockResolvedValue(mockResult);

            const result = await HistoryExerciseModel.findAll({ userId: mockUserId });

            expect(ObjectId.createFromHexString).toHaveBeenCalledWith(mockUserId);
            expect(mockFind).toHaveBeenCalledWith({ userId: mockUserId });
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(mockToArray).toHaveBeenCalled();
            expect(result).toEqual(mockResult);
        });

        it('should throw an error if database operation fails', async () => {
            const errorMessage = 'Database error';
            mockFind.mockImplementation(() => {
                throw new Error(errorMessage);
            });

            await expect(HistoryExerciseModel.findAll({ userId: '123' })).rejects.toThrow();
        });
    });

    describe('addToLogs', () => {
        const mockCurrentDate = new Date('2023-01-01T00:00:00.000Z');

        beforeEach(() => {
            // Mock Date constructor and now function
            global.Date = jest.fn(() => mockCurrentDate);
            global.Date.prototype.toISOString = jest.fn(() => '2023-01-01T00:00:00.000Z');
        });

        afterEach(() => {
            // Restore Date
            global.Date = Date;
        });

        it('should add a new history log with categoryId and userGoalId', async () => {
            const mockUserId = '123456789012';
            const mockCategoryId = '987654321098';
            const mockUserGoalId = '567890123456';
            const mockInsertResult = {
                acknowledged: true,
                insertedId: 'abc123'
            };

            mockInsertOne.mockResolvedValue(mockInsertResult);

            const result = await HistoryExerciseModel.addToLogs({
                userId: mockUserId,
                categoryId: mockCategoryId,
                userGoalId: mockUserGoalId
            });

            expect(ObjectId.createFromHexString).toHaveBeenCalledWith(mockUserId);
            expect(ObjectId.createFromHexString).toHaveBeenCalledWith(mockCategoryId);
            expect(ObjectId.createFromHexString).toHaveBeenCalledWith(mockUserGoalId);

            expect(mockInsertOne).toHaveBeenCalledWith(expect.objectContaining({
                userId: mockUserId,
                categoryId: mockCategoryId,
                userGoalId: mockUserGoalId,
                date: '2023-01-01T00:00:00.000Z',
                createdAt: mockCurrentDate
            }));

            expect(result).toEqual(mockInsertResult);
        });

        it('should add a new history log with only categoryId (userGoalId null)', async () => {
            const mockUserId = '123456789012';
            const mockCategoryId = '987654321098';
            const mockInsertResult = {
                acknowledged: true,
                insertedId: 'abc123'
            };

            mockInsertOne.mockResolvedValue(mockInsertResult);

            const result = await HistoryExerciseModel.addToLogs({
                userId: mockUserId,
                categoryId: mockCategoryId
            });

            expect(ObjectId.createFromHexString).toHaveBeenCalledWith(mockUserId);
            expect(ObjectId.createFromHexString).toHaveBeenCalledWith(mockCategoryId);

            expect(mockInsertOne).toHaveBeenCalledWith(expect.objectContaining({
                userId: mockUserId,
                categoryId: mockCategoryId,
                userGoalId: null,
                date: '2023-01-01T00:00:00.000Z',
                createdAt: mockCurrentDate
            }));

            expect(result).toEqual(mockInsertResult);
        });

        it('should add a new history log with only userGoalId (categoryId null)', async () => {
            const mockUserId = '123456789012';
            const mockUserGoalId = '567890123456';
            const mockInsertResult = {
                acknowledged: true,
                insertedId: 'abc123'
            };

            mockInsertOne.mockResolvedValue(mockInsertResult);

            const result = await HistoryExerciseModel.addToLogs({
                userId: mockUserId,
                userGoalId: mockUserGoalId
            });

            expect(ObjectId.createFromHexString).toHaveBeenCalledWith(mockUserId);
            expect(ObjectId.createFromHexString).toHaveBeenCalledWith(mockUserGoalId);

            expect(mockInsertOne).toHaveBeenCalledWith(expect.objectContaining({
                userId: mockUserId,
                categoryId: null,
                userGoalId: mockUserGoalId,
                date: '2023-01-01T00:00:00.000Z',
                createdAt: mockCurrentDate
            }));

            expect(result).toEqual(mockInsertResult);
        });

        it('should throw an error if database operation fails', async () => {
            const errorMessage = 'Database error';
            mockInsertOne.mockImplementation(() => {
                throw new Error(errorMessage);
            });

            await expect(HistoryExerciseModel.addToLogs({
                userId: '123',
                categoryId: '456',
                userGoalId: '789'
            })).rejects.toThrow();
        });
    });
});

describe('HistoryCategorySchema Resolvers', () => {
    let mockAuthentication;
    let mockContext;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mocks for model methods
        jest.spyOn(HistoryExerciseModel, 'findAll').mockImplementation();
        jest.spyOn(HistoryExerciseModel, 'addToLogs').mockImplementation();

        // Mock authentication context
        mockAuthentication = jest.fn();
        mockContext = {
            authentication: mockAuthentication
        };
    });

    describe('Query.historyCategory', () => {
        it('should return history categories for an authenticated user', async () => {
            const mockUser = { _id: '123456789012' };
            const mockHistories = [
                { _id: '1', userId: mockUser._id, categoryId: '111', userGoalId: '222' },
                { _id: '2', userId: mockUser._id, categoryId: '333', userGoalId: '444' }
            ];

            mockAuthentication.mockResolvedValue(mockUser);
            HistoryExerciseModel.findAll.mockResolvedValue(mockHistories);

            const result = await historyExerciseResolvers.Query.historyCategory(null, null, mockContext);

            expect(mockAuthentication).toHaveBeenCalled();
            expect(HistoryExerciseModel.findAll).toHaveBeenCalledWith({ userId: mockUser._id });
            expect(result).toEqual(mockHistories);
        });

        it('should throw an error if authentication fails', async () => {
            const errorMessage = 'Authentication failed';
            mockAuthentication.mockRejectedValue(new Error(errorMessage));

            await expect(historyExerciseResolvers.Query.historyCategory(null, null, mockContext))
                .rejects.toThrow();
        });

        it('should throw an error if finding history categories fails', async () => {
            const mockUser = { _id: '123456789012' };
            const errorMessage = 'Database error';

            mockAuthentication.mockResolvedValue(mockUser);
            HistoryExerciseModel.findAll.mockRejectedValue(new Error(errorMessage));

            await expect(historyExerciseResolvers.Query.historyCategory(null, null, mockContext))
                .rejects.toThrow();
        });
    });

    describe('Mutation.createHistoryCategory', () => {
        it('should create a new history category successfully', async () => {
            const mockUser = { _id: '123456789012' };
            const mockCategoryId = '987654321098';
            const mockUserGoalId = '567890123456';
            const mockResult = {
                _id: 'abc123',
                userId: mockUser._id,
                categoryId: mockCategoryId,
                userGoalId: mockUserGoalId
            };

            mockAuthentication.mockResolvedValue(mockUser);
            HistoryExerciseModel.addToLogs.mockResolvedValue(mockResult);

            const result = await historyExerciseResolvers.Mutation.createHistoryCategory(
                null,
                { categoryId: mockCategoryId, userGoalId: mockUserGoalId },
                mockContext
            );

            expect(mockAuthentication).toHaveBeenCalled();
            expect(HistoryExerciseModel.addToLogs).toHaveBeenCalledWith({
                userId: mockUser._id,
                categoryId: mockCategoryId,
                userGoalId: mockUserGoalId
            });
            expect(result).toEqual(mockResult);
        });

        it('should throw an error if authentication fails', async () => {
            const errorMessage = 'Authentication failed';
            mockAuthentication.mockRejectedValue(new Error(errorMessage));

            await expect(historyExerciseResolvers.Mutation.createHistoryCategory(
                null,
                { categoryId: '123', userGoalId: '456' },
                mockContext
            )).rejects.toThrow();
        });

        it('should throw an error if creating history category fails', async () => {
            const mockUser = { _id: '123456789012' };
            const errorMessage = 'Database error';

            mockAuthentication.mockResolvedValue(mockUser);
            HistoryExerciseModel.addToLogs.mockRejectedValue(new Error(errorMessage));

            await expect(historyExerciseResolvers.Mutation.createHistoryCategory(
                null,
                { categoryId: '123', userGoalId: '456' },
                mockContext
            )).rejects.toThrow();
        });
    });
});

