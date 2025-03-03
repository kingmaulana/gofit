const { ObjectId } = require("mongodb")
const { database } = require("../config/mongodb")
const { chatSession } = require("../service/AIModal")

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
        console.log("🚀 ~ UserGoalModel ~ createGoal ~ args:", args)
        try {
            const goal = await this.collection().insertOne({
                goalName: args.goalName,
                userId: args.userId,
                startWeight: args.startWeight,
                goalWeight: args.goalWeight,
                startDate: args.startDate,
                exercise: []
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

    static async createSuggestionAI(args) {
        try {
            // Cari user goal terkait
            const userGoal = await this.collection().findOne({
                userId: new ObjectId(args.userId)
            });
    
            if (!userGoal) {
                throw new Error('No goal found for the user');
            }
    
            // List exercise yang bakal jadi parameter AI
            const DATA_EXERCISE = require('../constant/data_exercise.json'); // Your list of exercises
    
            // Send the message to the chat session
            const result = await chatSession.sendMessage(`My Data: ${DATA_EXERCISE}, from that data please give me 5 exercise recommendations for adding weight, and I have an injury in my legs and am underweight?`);
            
            // Get the response text
            const responseText = await result.response.text();
    
            // Log the full response to understand the structure of candidates
            const formattedResponse = {
                success: true,
                data: {
                    response: {
                        text: responseText
                    }
                }
            };
    
            // Parse the response to JSON
            const jsonResponse = JSON.parse(formattedResponse.data.response.text);
            console.log("🚀 ~ testChatSession ~ jsonResponse:", jsonResponse);
    
            // Extract recommended exercises
            const recommendedExercises = jsonResponse.exercises; // assuming the response contains "exercises" field
    
            if (recommendedExercises && Array.isArray(recommendedExercises)) {
                // Push exercises into the userGoal's exercise array, ensuring no duplicates
                await this.collection().updateOne(
                    { userId: new ObjectId(args.userId) },
                    { $addToSet: { exercise: { $each: recommendedExercises } } }  // $addToSet ensures unique exercises
                );
            }
    
            // Optional: Log the update result
            console.log("Updated UserGoal:", userGoal);
    
            // Return a success response
            return { success: true, message: "Exercises updated successfully" };
    
        } catch (error) {
            console.error("Error in createSuggestionAI:", error);
            throw new Error(error);
        }
    }
    
}

module.exports = UserGoalModel