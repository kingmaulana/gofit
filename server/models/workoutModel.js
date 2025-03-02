const { ObjectId } = require("mongodb")
const { database } = require("../config/mongodb")

class WorkoutModel {
    static collection() {
        return database.collection("exercise")
    }

    static collectionCategory() {
        return database.collection("category_exercise")
    }

    static async findAll() {
        try {
            const workouts = await this.collection().find().toArray()
            return workouts
        } catch (error) {
            throw new Error(error)
        }
    }

    static async findById(id) {
        try {
            const workout = await this.collection().findOne({
                _id: new ObjectId(id)
            })
            return workout
        } catch (error) {
            throw new Error(error)
        }
    }

    static async findByCategory(category) {
        try {
            const workouts = await this.collection().find({
                category: ""
            }).toArray()
            return workouts
        } catch (error) {
            throw new Error(error)
        }
    }


}

module.exports = WorkoutModel