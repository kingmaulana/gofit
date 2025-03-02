const { ObjectId } = require("mongodb")
const { database } = require("../config/mongodb")


class UserExerciseModel {
    static collection() {
        return database.collection("user_exercise")
    }

    //Supaya bsia menemukan exercise yg sudah di buat user
    static async findAll(id) {
        // console.log("🚀 ~ UserExerciseModel ~ findAll ~ id:", id)
        try {
            const userExercises = await this.collection()
            .find({userId: id})
            .toArray()
            return userExercises
        } catch (error) {
            throw new Error(error)
        }
    }

    static async create(args) {
        try {
            const userExercise = await this.collection()
            .insertOne({
                name: args.name,
                userId: args.userId,
                exerciseId: args.exerciseId
            })

            const exerciseAdd = await this.collection().findOne({_id: userExercise.insertedId})
            return exerciseAdd
        } catch (error) {
            throw new Error(error)
        }
    }

    static async updateName(args) {
        try {
            const userExercise = await this.collection()
            .updateOne(
                {_id: new ObjectId(args.id)},
                {$set: {
                    name: args.name
                }}
            )
            const exerciseUpdate = await this.collection().findOne({_id: new ObjectId(args.id)})
            return exerciseUpdate
        } catch (error) {
            throw new Error(error)
        }
    }

    static async updateExercise(args) {
        console.log("🚀 ~ UserExerciseModel ~ updateExercise ~ args:", args)
        try {
            const userExercise = await this.collection()
            .updateOne(
                {_id: new ObjectId(args.id)},
                { $push: { exerciseId: { $each: args.exerciseId } } }
            )
            const exerciseUpdate = await this.collection().findOne({_id: new ObjectId(args.id)})
            return exerciseUpdate
        } catch (error) {
            throw new Error(error)
        }
    }

    static async deleteCollectionExercise(id) {
        try {
            const userExercise = await this.collection()
            .deleteOne({_id: new ObjectId(id)})

            if (userExercise.deletedCount === 0) {
                throw new Error("No document found to delete");
            }


            return userExercise
        } catch (error) {
            throw new Error(error)
        }
    }

    static async deleteExercise(args) {
        
        try {
            if (!ObjectId.isValid(args.id)) {
                throw new Error("Invalid ObjectId format");
            }
    
            const userExercise = await this.collection().updateOne(
                { _id: new ObjectId(args.id) }, 
                { $pull: { exerciseId: args.exerciseId } } 
            );

            if (userExercise.modifiedCount === 0) {
                throw new Error("Exercise ID not found or already removed");
            }
    
            const exerciseUpdate = await this.collection().findOne({ _id: new ObjectId(args.id) });
            return exerciseUpdate;
        } catch (error) {
            console.error("Error deleting exercise:", error);
            throw new Error(error);
        }
    }
}

module.exports = UserExerciseModel  