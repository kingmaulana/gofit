const { database } = require("../config/mongodb")
const {ObjectId} = require("mongodb");


class HistoryExerciseModel {
    static collection() {
        return database.collection("history_logs_categoryExercise")
    }

    // Menampilkan history exercise user bersangkutan
    static async findAll(args) {
        // console.log("🚀 ~ HistoryExerciseModel ~ findAll ~ args:", args)
        try {
            const history = await this.collection()
            .find({userId: ObjectId.createFromHexString(args.userId)})
            .sort({ createdAt: -1 }) //biar sorting dari yang paling baru
            .toArray()
            return history
        } catch (error) {
            throw new Error(error)
        }
    }

    // fungsi ini akan otomatis menambahkan log history exercise user setiap selesai sesi exercise
    static async addToLogs(args) {
        try {
            const logEntry = {
                userId: ObjectId.createFromHexString(args.userId),
                categoryId: ObjectId.createFromHexString(args.categoryId),
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