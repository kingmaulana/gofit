const { ObjectId } = require("mongodb")
const { database } = require("../config/mongodb")


class UserExerciseModel {
    static collection() {
        return database.collection("user_exercise")
    }

    static collectionDBCategoryNonArray() {
        return database.collection("category_exercise")
    }

    static async collectionCategory() {
        // Get collection and fetch all data
        const collection = database.collection("category_exercise");
        const categories = await collection.find().toArray();  // Fetch all documents and return as an array
        return categories;
    }

    static async collectionCategory() {
        // Get collection and fetch all data
        const collection = database.collection("category_exercise");
        const categories = await collection.find().toArray();  // Fetch all documents and return as an array
        return categories;
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
                exerciseId: args.exerciseId,
                duration: args.duration,
                restDuration: args.restDuration
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


    static async findAllCategories() {
        try {
            // Fetch categories from the collection
            const categories = await this.collectionCategory();
            // console.log("🚀 ~ UserExerciseModel ~ findAllCategories ~ categories:", categories);
            return categories;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw new Error(error);
        }
    }

    static async getCategoryById(idCategory) {
        try {
            // Step 1: Perform aggregation to look up exercises based on exerciseId
            const result = await this.collectionDBCategoryNonArray().aggregate([
                {
                    // Match the category by the provided idCategory
                    $match: {
                        _id: new ObjectId(idCategory)
                    }
                },
                {
                    // Use $addFields to convert exerciseId strings to ObjectIds
                    $addFields: {
                        exerciseId: {
                            $map: {
                                input: "$exerciseId", // The exerciseId array
                                as: "id",
                                in: { $toObjectId: "$$id" } // Convert string to ObjectId
                            }
                        }
                    }
                },
                {
                    // Perform the lookup to join the exercises collection based on exerciseId array
                    $lookup: {
                        from: "exercise", // The exercises collection name
                        localField: "exerciseId", // The field in the category collection containing ObjectId array
                        foreignField: "_id", // The field in the exercises collection that we match against
                        as: "exercises" // The name of the array that will hold the matched exercises
                    }
                },
                {
                    // Optionally, use $unwind to flatten the exercises array
                    $unwind: {
                        path: "$exercise",
                        preserveNullAndEmptyArrays: true // This ensures categories without exercises will still be returned
                    }
                }
            ]).toArray();
    
            // Step 2: Handle the result (result is an array with a single category document)
            if (result.length === 0) {
                throw new Error("Category not found");
            }
    
            // Extract category data and exercises
            const category = result[0];
            // console.log("🚀 ~ Category with exercises:", category);
    
            return category;
        } catch (error) {
            console.error("Error fetching category and exercises:", error);
            throw new Error(error);
        }
    }
       

    
}

module.exports = UserExerciseModel  