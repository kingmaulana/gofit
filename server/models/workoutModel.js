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

    static async workoutByFilter(args) {
        console.log("🚀 ~ WorkoutModel ~ workoutByFilter ~ args:", args);
        try {
            // Build the filter object dynamically
            const filter = {};

            // If category is provided, add it to the filter
            if (args.category) {
                filter.category = args.category;
            }

            // If equipment is provided, add it to the filter
            if (args.equipment) {
                filter.equipment = args.equipment;
            }

            // If level is provided, add it to the filter
            if (args.level) {
                filter.level = args.level;
            }

            // Query the database with the dynamically constructed filter
            const workouts = await this.collection().find(filter).toArray();
            return workouts;
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = WorkoutModel