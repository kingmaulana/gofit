const { database } = require("../config/mongodb")

class UserGoalModel {
    static collection() {
        return database.collection("user_goal")
    }

    static collectionProgress() {
        return database.collection("weight_progress")
    }

    static async findGoal(args) {
        try {
            const goal = await this.collection().findOne({
                userId: args.userId
            })
            return goal
        } catch (error) {
            throw new Error(error)
        }
    }

    static async createGoal(args) {
        try {
            const goal = await this.collection().insertOne({
                goalName: args.goalName,
                userId: args.userId,
                startWeight: 92,
                goalWeight: args.goalWeight,
                startDate: args.startDate,
            })
            return goal
        } catch (error) {
            throw new Error(error)
        }
    }

    static async updateWeightProgress(args) {
        try {
            const weightProgress = await this.collectionProgress().insertOne({
                userId: args.userId,
                weight: args.weight,
                date: new Date().toISOString(),
            })
            return weightProgress
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = UserGoalModel