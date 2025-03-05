const { database } = require("../config/mongodb")
const {ObjectId} = require("mongodb");


class HistoryExerciseModel {
    static collection() {
        return database.collection("history_logs_categoryExercise")
    }

    // Menampilkan history exercise user bersangkutan
    static async findAll(args) {
        try {
            const history = await this.collection()
                .aggregate([
                    {
                        $match: {
                            userId: ObjectId.createFromHexString(args.userId),
                        },
                    },
                    {
                        // First lookup based on categoryId
                        $lookup: {
                            from: 'category_exercise', // Join category_exercise collection
                            localField: 'categoryId',   // Match categoryId from historyCategory
                            foreignField: '_id',        // Match _id from category_exercise
                            as: 'category',
                        },
                    },
                    {
                        // Second lookup based on userGoalId (if categoryId doesn't match)
                        $lookup: {
                            from: 'user_goal', // Join user_goal collection
                            localField: 'userGoalId', // Match userGoalId from historyCategory
                            foreignField: '_id', // Match _id from user_goal
                            as: 'userGoal',
                        },
                    },
                    {
                        $unwind: {
                            path: '$category', // Unwind category array to make it accessible
                            preserveNullAndEmptyArrays: true, // Keep documents with no categoryId
                        },
                    },
                    {
                        $unwind: {
                            path: '$userGoal', // Unwind userGoal array to make it accessible
                            preserveNullAndEmptyArrays: true, // Keep documents with no userGoalId
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            userId: 1,
                            categoryId: 1,
                            userGoalId: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            categoryName: { $ifNull: ['$category.name', null] }, // Category name or null if no category
                            goalName: { $ifNull: ['$userGoal.goalName', null] }, // Goal name or null if no goal
                        },
                    },
                    {
                        $sort: { createdAt: -1 }, // Sort by createdAt in descending order
                    },
                ])
                .toArray();
    
                // console.log("🚀 ~ HistoryExerciseModel ~ findAll ~ history:", history)
            return history;
        } catch (error) {
            throw new Error(error);
        }
    }
    
    

    // fungsi ini akan otomatis menambahkan log history exercise user setiap selesai sesi exercise
    static async addToLogs(args) {
        try {
            let userGoalId = null
            let categoryId = null
            let userExerciseId = null
            if(args.categoryId) {
                categoryId = ObjectId.createFromHexString(args.categoryId)
            } 

            if(args.userGoalId) {
                userGoalId = ObjectId.createFromHexString(args.userGoalId)
            }

            if(args.userExerciseId) {
                userExerciseId = ObjectId.createFromHexString(args.userExerciseId);
            }

            const logEntry = {
                userId: ObjectId.createFromHexString(args.userId),
                userGoalId,
                categoryId,
                userExerciseId,
                date: new Date().toISOString(),
                createdAt: new Date(),
            }

            const history = await this.collection()
            .insertOne(logEntry)
            return history
        } catch (error) {
            throw new Error(error)
        }
    }

}

module.exports = HistoryExerciseModel