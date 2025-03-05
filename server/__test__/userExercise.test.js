const UserExerciseModel = require('../models/userExerciseModel');
const { userExerciseResolvers } = require('../schemas/userExerciseSchema');
const { ObjectId } = require('mongodb');

// Mock the mongodb module
jest.mock('mongodb', () => {
    const mockObjectId = jest.fn().mockImplementation((id) => ({
        toString: () => id?.toString() || 'mockedObjectId',
        toHexString: () => id?.toString() || 'mockedObjectId'
    }));

    mockObjectId.isValid = jest.fn().mockImplementation((id) => {
        // Basic validation for test purposes
        return id && typeof id === 'string' && id.length > 0;
    });

    return {
        ObjectId: mockObjectId
    };
});

// Mock the mongodb database
jest.mock('../config/mongodb', () => {
    const mockFind = jest.fn();
    const mockToArray = jest.fn();
    const mockFindOne = jest.fn();
    const mockInsertOne = jest.fn();
    const mockUpdateOne = jest.fn();
    const mockDeleteOne = jest.fn();
    const mockAggregate = jest.fn();

    // Configure mockFind to return an object with toArray method
    mockFind.mockReturnValue({
        toArray: mockToArray
    });

    // Configure mockAggregate to return an object with toArray method
    mockAggregate.mockReturnValue({
        toArray: mockToArray
    });

    // Create a mock collection for chaining methods
    const mockCollection = {
        find: mockFind,
        findOne: mockFindOne,
        insertOne: mockInsertOne,
        updateOne: mockUpdateOne,
        deleteOne: mockDeleteOne,
        aggregate: mockAggregate
    };

    // Create the mock database object
    const mockDatabase = {
        collection: jest.fn().mockReturnValue(mockCollection)
    };

    return {
        database: mockDatabase,
        mockFind,
        mockToArray,
        mockFindOne,
        mockInsertOne,
        mockUpdateOne,
        mockDeleteOne,
        mockAggregate,
        mockCollection
    };
});

// Import the mocked modules so we can use them in tests
const {
    database,
    mockFind,
    mockToArray,
    mockFindOne,
    mockInsertOne,
    mockUpdateOne,
    mockDeleteOne,
    mockAggregate
} = require('../config/mongodb');

describe('UserExerciseModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('collection method', () => {
        it('should return the user_exercise collection', () => {
            const collection = UserExerciseModel.collection();
            expect(database.collection).toHaveBeenCalledWith('user_exercise');
            expect(collection).toBe(database.collection());
        });
    });

    describe('collectionDBCategoryNonArray method', () => {
        it('should return the category_exercise collection', () => {
            const collection = UserExerciseModel.collectionDBCategoryNonArray();
            expect(database.collection).toHaveBeenCalledWith('category_exercise');
            expect(collection).toBe(database.collection());
        });
    });

    describe('collectionCategory method', () => {
        it('should fetch all categories from the category_exercise collection', async () => {
            const mockCategories = [{ _id: 'cat1', name: 'Category 1' }];
            mockToArray.mockResolvedValue(mockCategories);

            const categories = await UserExerciseModel.collectionCategory();

            expect(database.collection).toHaveBeenCalledWith('category_exercise');
            expect(mockFind).toHaveBeenCalled();
            expect(mockToArray).toHaveBeenCalled();
            expect(categories).toEqual(mockCategories);
        });

        it('should handle errors when fetching categories', async () => {
            mockToArray.mockRejectedValue(new Error('Database error'));

            await expect(UserExerciseModel.collectionCategory()).rejects.toThrow('Database error');
        });
    });

    describe('findAll method', () => {
        it('should find all exercises for a specific user', async () => {
            const mockUserId = 'user123';
            const mockExercises = [
                { _id: 'ex1', name: 'Exercise 1', userId: mockUserId },
                { _id: 'ex2', name: 'Exercise 2', userId: mockUserId }
            ];
            mockToArray.mockResolvedValue(mockExercises);

            const result = await UserExerciseModel.findAll(mockUserId);

            expect(database.collection).toHaveBeenCalledWith('user_exercise');
            expect(mockFind).toHaveBeenCalledWith({ userId: mockUserId });
            expect(mockToArray).toHaveBeenCalled();
            expect(result).toEqual(mockExercises);
        });

        it('should handle errors when finding exercises', async () => {
            mockToArray.mockRejectedValue(new Error('Find error'));

            await expect(UserExerciseModel.findAll('user123')).rejects.toThrow('Find error');
        });
    });

    describe('create method', () => {
        it('should create a new user exercise', async () => {
            const mockArgs = {
                name: 'New Exercise',
                userId: 'user123',
                exerciseId: ['ex1', 'ex2'],
                duration: 30,
                restDuration: 10
            };
            const mockInsertResult = { insertedId: 'newId' };
            const mockCreatedExercise = {
                _id: 'newId',
                ...mockArgs
            };

            mockInsertOne.mockResolvedValue(mockInsertResult);
            mockFindOne.mockResolvedValue(mockCreatedExercise);

            const result = await UserExerciseModel.create(mockArgs);

            expect(database.collection).toHaveBeenCalledWith('user_exercise');
            expect(mockInsertOne).toHaveBeenCalledWith({
                name: mockArgs.name,
                userId: mockArgs.userId,
                exerciseId: mockArgs.exerciseId,
                duration: mockArgs.duration,
                restDuration: mockArgs.restDuration
            });
            expect(mockFindOne).toHaveBeenCalledWith({ _id: mockInsertResult.insertedId });
            expect(result).toEqual(mockCreatedExercise);
        });

        it('should handle errors when creating exercise', async () => {
            mockInsertOne.mockRejectedValue(new Error('Insert error'));

            await expect(UserExerciseModel.create({
                name: 'Test',
                userId: 'user123'
            })).rejects.toThrow('Insert error');
        });
    });

    describe('updateName method', () => {
        it('should update the name of an exercise', async () => {
            const mockArgs = {
                id: '507f1f77bcf86cd799439011',
                name: 'Updated Exercise Name'
            };
            const mockUpdatedExercise = {
                _id: mockArgs.id,
                name: mockArgs.name,
                userId: 'user123'
            };

            mockUpdateOne.mockResolvedValue({ modifiedCount: 1 });
            mockFindOne.mockResolvedValue(mockUpdatedExercise);

            const result = await UserExerciseModel.updateName(mockArgs);

            expect(database.collection).toHaveBeenCalledWith('user_exercise');
            expect(mockUpdateOne).toHaveBeenCalledWith(
                expect.objectContaining({ _id: expect.anything() }),
                { $set: { name: mockArgs.name } }
            );
            expect(mockFindOne).toHaveBeenCalledWith(expect.objectContaining({ _id: expect.anything() }));
            expect(result).toEqual(mockUpdatedExercise);
        });

        it('should handle errors when updating exercise name', async () => {
            mockUpdateOne.mockRejectedValue(new Error('Update error'));

            await expect(UserExerciseModel.updateName({
                id: '507f1f77bcf86cd799439011',
                name: 'Updated Name'
            })).rejects.toThrow('Update error');
        });
    });

    describe('updateExercise method', () => {
        it('should add exercises to an existing collection', async () => {
            const mockArgs = {
                id: '507f1f77bcf86cd799439011',
                exerciseId: ['newEx1', 'newEx2']
            };
            const mockUpdatedExercise = {
                _id: mockArgs.id,
                name: 'Exercise Collection',
                exerciseId: ['ex1', 'ex2', 'newEx1', 'newEx2']
            };

            mockUpdateOne.mockResolvedValue({ modifiedCount: 1 });
            mockFindOne.mockResolvedValue(mockUpdatedExercise);

            const result = await UserExerciseModel.updateExercise(mockArgs);

            expect(database.collection).toHaveBeenCalledWith('user_exercise');
            expect(mockUpdateOne).toHaveBeenCalledWith(
                expect.objectContaining({ _id: expect.anything() }),
                { $push: { exerciseId: { $each: mockArgs.exerciseId } } }
            );
            expect(mockFindOne).toHaveBeenCalledWith(expect.objectContaining({ _id: expect.anything() }));
            expect(result).toEqual(mockUpdatedExercise);
        });

        it('should handle errors when updating exercises', async () => {
            mockUpdateOne.mockRejectedValue(new Error('Update exercises error'));

            await expect(UserExerciseModel.updateExercise({
                id: '507f1f77bcf86cd799439011',
                exerciseId: ['newEx1']
            })).rejects.toThrow('Update exercises error');
        });
    });

    describe('deleteCollectionExercise method', () => {
        it('should delete an exercise collection successfully', async () => {
            const mockId = '507f1f77bcf86cd799439011';
            const mockDeleteResult = { deletedCount: 1 };

            mockDeleteOne.mockResolvedValue(mockDeleteResult);

            const result = await UserExerciseModel.deleteCollectionExercise(mockId);

            expect(database.collection).toHaveBeenCalledWith('user_exercise');
            expect(mockDeleteOne).toHaveBeenCalledWith(expect.objectContaining({ _id: expect.anything() }));
            expect(result).toEqual(mockDeleteResult);
        });

        it('should throw error if no document is deleted', async () => {
            const mockDeleteResult = { deletedCount: 0 };
            mockDeleteOne.mockResolvedValue(mockDeleteResult);

            await expect(UserExerciseModel.deleteCollectionExercise('nonexistentId'))
                .rejects.toThrow('No document found to delete');
        });

        it('should handle errors when deleting collection', async () => {
            mockDeleteOne.mockRejectedValue(new Error('Delete error'));

            await expect(UserExerciseModel.deleteCollectionExercise('507f1f77bcf86cd799439011'))
                .rejects.toThrow('Delete error');
        });
    });

    describe('deleteExercise method', () => {
        it('should delete an exercise from a collection', async () => {
            const mockArgs = {
                id: '507f1f77bcf86cd799439011',
                exerciseId: 'ex1'
            };
            const mockUpdateResult = { modifiedCount: 1 };
            const mockUpdatedExercise = {
                _id: mockArgs.id,
                name: 'Exercise Collection',
                exerciseId: ['ex2', 'ex3'] // ex1 has been removed
            };

            mockUpdateOne.mockResolvedValue(mockUpdateResult);
            mockFindOne.mockResolvedValue(mockUpdatedExercise);

            const result = await UserExerciseModel.deleteExercise(mockArgs);

            expect(database.collection).toHaveBeenCalledWith('user_exercise');
            expect(mockUpdateOne).toHaveBeenCalledWith(
                expect.objectContaining({ _id: expect.anything() }),
                { $pull: { exerciseId: mockArgs.exerciseId } }
            );
            expect(mockFindOne).toHaveBeenCalledWith(expect.objectContaining({ _id: expect.anything() }));
            expect(result).toEqual(mockUpdatedExercise);
        });

        it('should throw error for invalid ObjectId', async () => {
            // Mock ObjectId.isValid to return false for this test
            ObjectId.isValid.mockReturnValueOnce(false);

            await expect(UserExerciseModel.deleteExercise({
                id: 'invalid-id',
                exerciseId: 'ex1'
            })).rejects.toThrow('Invalid ObjectId format');
        });

        it('should throw error if no exercise is deleted', async () => {
            const mockUpdateResult = { modifiedCount: 0 };
            mockUpdateOne.mockResolvedValue(mockUpdateResult);

            await expect(UserExerciseModel.deleteExercise({
                id: '507f1f77bcf86cd799439011',
                exerciseId: 'nonexistentEx'
            })).rejects.toThrow('Exercise ID not found or already removed');
        });

        it('should handle errors when deleting exercise', async () => {
            mockUpdateOne.mockRejectedValue(new Error('Delete exercise error'));

            await expect(UserExerciseModel.deleteExercise({
                id: '507f1f77bcf86cd799439011',
                exerciseId: 'ex1'
            })).rejects.toThrow('Delete exercise error');
        });
    });

    describe('findAllCategories method', () => {
        it('should return all categories', async () => {
            const mockCategories = [
                { _id: 'cat1', name: 'Category 1', exerciseId: ['ex1', 'ex2'] },
                { _id: 'cat2', name: 'Category 2', exerciseId: ['ex3', 'ex4'] }
            ];
            mockToArray.mockResolvedValue(mockCategories);

            const result = await UserExerciseModel.findAllCategories();

            expect(database.collection).toHaveBeenCalledWith('category_exercise');
            expect(mockFind).toHaveBeenCalled();
            expect(mockToArray).toHaveBeenCalled();
            expect(result).toEqual(mockCategories);
        });

        it('should handle errors when fetching categories', async () => {
            mockToArray.mockRejectedValue(new Error('Fetch categories error'));

            await expect(UserExerciseModel.findAllCategories())
                .rejects.toThrow('Fetch categories error');
        });
    });

    describe('getCategoryById method', () => {
        it('should return a category with its exercises', async () => {
            const mockCategoryId = '507f1f77bcf86cd799439011';
            const mockAggregationResult = [{
                _id: new ObjectId(mockCategoryId),
                name: 'Chest Workout',
                exerciseId: ['ex1', 'ex2'],
                exercises: [
                    { _id: 'ex1', name: 'Bench Press' },
                    { _id: 'ex2', name: 'Push-ups' }
                ]
            }];
            mockToArray.mockResolvedValue(mockAggregationResult);

            const result = await UserExerciseModel.getCategoryById(mockCategoryId);

            expect(database.collection).toHaveBeenCalledWith('category_exercise');
            expect(mockAggregate).toHaveBeenCalled();
            expect(mockToArray).toHaveBeenCalled();
            expect(result).toEqual(mockAggregationResult[0]);
        });

        it('should throw error when category is not found', async () => {
            mockToArray.mockResolvedValue([]);

            await expect(UserExerciseModel.getCategoryById('507f1f77bcf86cd799439011'))
                .rejects.toThrow('Category not found');
        });

        it('should handle errors in aggregation', async () => {
            mockToArray.mockRejectedValue(new Error('Aggregation error'));

            await expect(UserExerciseModel.getCategoryById('507f1f77bcf86cd799439011'))
                .rejects.toThrow('Aggregation error');
        });
    });
});

describe('UserExerciseSchema resolvers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Query resolvers', () => {
        describe('userExercises resolver', () => {
            it('should return user exercises', async () => {
                const mockUserId = 'user123';
                const mockExercises = [
                    { _id: 'ex1', name: 'Exercise 1', userId: mockUserId },
                    { _id: 'ex2', name: 'Exercise 2', userId: mockUserId }
                ];

                // Mock the UserExerciseModel.findAll method
                jest.spyOn(UserExerciseModel, 'findAll').mockResolvedValue(mockExercises);

                const result = await userExerciseResolvers.Query.userExercises(null, { id: mockUserId });

                expect(UserExerciseModel.findAll).toHaveBeenCalledWith(mockUserId);
                expect(result).toEqual(mockExercises);
            });

            it('should handle errors', async () => {
                jest.spyOn(UserExerciseModel, 'findAll').mockRejectedValue(new Error('Find error'));

                await expect(userExerciseResolvers.Query.userExercises(null, { id: 'user123' }))
                    .rejects.toThrow('Find error');
            });
        });

        describe('exerciseCategories resolver', () => {
            it('should return all exercise categories', async () => {
                const mockCategories = [
                    { _id: 'cat1', name: 'Category 1', exerciseId: ['ex1', 'ex2'] },
                    { _id: 'cat2', name: 'Category 2', exerciseId: ['ex3', 'ex4'] }
                ];

                // Mock the UserExerciseModel.findAllCategories method
                jest.spyOn(UserExerciseModel, 'findAllCategories').mockResolvedValue(mockCategories);

                const result = await userExerciseResolvers.Query.exerciseCategories();

                expect(UserExerciseModel.findAllCategories).toHaveBeenCalled();
                expect(result).toEqual(mockCategories);
            });

            it('should handle errors', async () => {
                jest.spyOn(UserExerciseModel, 'findAllCategories').mockRejectedValue(new Error('Categories error'));

                await expect(userExerciseResolvers.Query.exerciseCategories())
                    .rejects.toThrow('Categories error');
            });
        });

        describe('getCategoryById resolver', () => {
            it('should return a category by id with exercises', async () => {
                const mockCategoryId = '507f1f77bcf86cd799439011';
                const mockCategory = {
                    _id: mockCategoryId,
                    name: 'Chest Workout',
                    exerciseId: ['ex1', 'ex2'],
                    exercises: [
                        { _id: 'ex1', name: 'Bench Press' },
                        { _id: 'ex2', name: 'Push-ups' }
                    ]
                };

                // Mock the UserExerciseModel.getCategoryById method
                jest.spyOn(UserExerciseModel, 'getCategoryById').mockResolvedValue(mockCategory);

                const result = await userExerciseResolvers.Query.getCategoryById(null, { idCategory: mockCategoryId });

                expect(UserExerciseModel.getCategoryById).toHaveBeenCalledWith(mockCategoryId);
                expect(result).toEqual(mockCategory);
            });

            it('should handle errors', async () => {
                jest.spyOn(UserExerciseModel, 'getCategoryById').mockRejectedValue(new Error('Category fetch error'));

                await expect(userExerciseResolvers.Query.getCategoryById(null, { idCategory: '507f1f77bcf86cd799439011' }))
                    .rejects.toThrow('Category fetch error');
            });
        });
    });

    describe('Mutation resolvers', () => {
        describe('addUserExercise resolver', () => {
            it('should create and return a new user exercise', async () => {
                const mockArgs = {
                    name: 'New Exercise',
                    userId: 'user123',
                    exerciseId: ['ex1', 'ex2'],
                    duration: 30,
                    restDuration: 10
                };
                const mockCreatedExercise = {
                    _id: 'newId',
                    ...mockArgs
                };

                // Mock the UserExerciseModel.create method
                jest.spyOn(UserExerciseModel, 'create').mockResolvedValue(mockCreatedExercise);

                const result = await userExerciseResolvers.Mutation.addUserExercise(null, mockArgs);

                expect(UserExerciseModel.create).toHaveBeenCalledWith(mockArgs);
                expect(result).toEqual(mockCreatedExercise);
            });

            it('should handle errors', async () => {
                const mockArgs = {
                    name: 'New Exercise',
                    userId: 'user123'
                };

                jest.spyOn(UserExerciseModel, 'create').mockRejectedValue(new Error('Create error'));

                await expect(userExerciseResolvers.Mutation.addUserExercise(null, mockArgs))
                    .rejects.toThrow('Create error');
            });
        });

        describe('updateName resolver', () => {
            it('should update and return the exercise with new name', async () => {
                const mockArgs = {
                    id: '507f1f77bcf86cd799439011',
                    name: 'Updated Exercise Name'
                };
                const mockUpdatedExercise = {
                    _id: mockArgs.id,
                    name: mockArgs.name,
                    userId: 'user123'
                };

                // Mock the UserExerciseModel.updateName method
                jest.spyOn(UserExerciseModel, 'updateName').mockResolvedValue(mockUpdatedExercise);

                const result = await userExerciseResolvers.Mutation.updateName(null, mockArgs);

                expect(UserExerciseModel.updateName).toHaveBeenCalledWith(mockArgs);
                expect(result).toEqual(mockUpdatedExercise);
            });

            it('should handle errors', async () => {
                const mockArgs = {
                    id: '507f1f77bcf86cd799439011',
                    name: 'Updated Name'
                };

                jest.spyOn(UserExerciseModel, 'updateName').mockRejectedValue(new Error('Update name error'));

                await expect(userExerciseResolvers.Mutation.updateName(null, mockArgs))
                    .rejects.toThrow('Update name error');
            });
        });

        describe('updateExercise resolver', () => {
            it('should update and return the exercise with new exercises', async () => {
                const mockArgs = {
                    id: '507f1f77bcf86cd799439011',
                    exerciseId: ['newEx1', 'newEx2']
                };
                const mockUpdatedExercise = {
                    _id: mockArgs.id,
                    name: 'Exercise Collection',
                    exerciseId: ['ex1', 'ex2', 'newEx1', 'newEx2']
                };

                // Mock the UserExerciseModel.updateExercise method
                jest.spyOn(UserExerciseModel, 'updateExercise').mockResolvedValue(mockUpdatedExercise);

                const result = await userExerciseResolvers.Mutation.updateExercise(null, mockArgs);

                expect(UserExerciseModel.updateExercise).toHaveBeenCalledWith(mockArgs);
                expect(result).toEqual(mockUpdatedExercise);
            });

            it('should handle errors', async () => {
                const mockArgs = {
                    id: '507f1f77bcf86cd799439011',
                    exerciseId: ['newEx1']
                };

                jest.spyOn(UserExerciseModel, 'updateExercise').mockRejectedValue(new Error('Update exercise error'));

                await expect(userExerciseResolvers.Mutation.updateExercise(null, mockArgs))
                    .rejects.toThrow('Update exercise error');
            });
        });

        describe('deleteCollectionExercise resolver', () => {
            it('should delete an exercise collection and return success message', async () => {
                const mockId = '507f1f77bcf86cd799439011';
                const mockDeleteResult = { deletedCount: 1 };

                // Mock the UserExerciseModel.deleteCollectionExercise method
                jest.spyOn(UserExerciseModel, 'deleteCollectionExercise').mockResolvedValue(mockDeleteResult);

                const result = await userExerciseResolvers.Mutation.deleteCollectionExercise(null, { id: mockId });

                expect(UserExerciseModel.deleteCollectionExercise).toHaveBeenCalledWith({ id: mockId });
                expect(result).toEqual('Delete success');
            });

            it('should handle errors', async () => {
                jest.spyOn(UserExerciseModel, 'deleteCollectionExercise').mockRejectedValue(new Error('Delete collection error'));

                await expect(userExerciseResolvers.Mutation.deleteCollectionExercise(null, { id: '507f1f77bcf86cd799439011' }))
                    .rejects.toThrow('Delete collection error');
            });
        });

        describe('deleteExercise resolver', () => {
            it('should delete an exercise from a collection and return success message', async () => {
                const mockArgs = {
                    id: '507f1f77bcf86cd799439011',
                    exerciseId: 'ex1'
                };
                const mockUpdatedExercise = {
                    _id: mockArgs.id,
                    name: 'Exercise Collection',
                    exerciseId: ['ex2', 'ex3'] // ex1 has been removed
                };

                // Mock the UserExerciseModel.deleteExercise method
                jest.spyOn(UserExerciseModel, 'deleteExercise').mockResolvedValue(mockUpdatedExercise);

                const result = await userExerciseResolvers.Mutation.deleteExercise(null, mockArgs);

                expect(UserExerciseModel.deleteExercise).toHaveBeenCalledWith(mockArgs);
                expect(result).toEqual('Delete success');
            });

            it('should handle errors', async () => {
                const mockArgs = {
                    id: '507f1f77bcf86cd799439011',
                    exerciseId: 'ex1'
                };

                jest.spyOn(UserExerciseModel, 'deleteExercise').mockRejectedValue(new Error('Delete exercise error'));

                await expect(userExerciseResolvers.Mutation.deleteExercise(null, mockArgs))
                    .rejects.toThrow('Delete exercise error');
            });
        });
    });
});
