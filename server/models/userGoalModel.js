const { ObjectId } = require("mongodb")
const { database } = require("../config/mongodb")
const { chatSession } = require("../service/AIModal")
const { analyticChat } = require("../service/AIAnalytic")

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
        // console.log("🚀 ~ UserGoalModel ~ createGoal ~ args:", args)
        try {
            const goal = await this.collection().insertOne({
                goalName: args.goalName,
                userId: args.userId,
                startWeight: args.startWeight,
                goalWeight: args.goalWeight,
                startDate: args.startDate,
                endGoal: args.endGoal,
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
        console.log("🚀 ~ UserGoalModel ~ createSuggestionAI ~ args:", args)
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
            const result = await chatSession.sendMessage(`My Data: ${DATA_EXERCISE}, from that data please give me 10-15 exercise recommendations for ${args.goalName}, and I have an injury in my legs, my current weight is ${args.weight} and my goal weight is ${args.goalWeight}, my gender is ${args.gender} also choose my level of exercise is ${args.activity}`);

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

    // Hanya aktifkan analyticAI saat user sudah update progress
    static async giveAnalyticByAI(args) {
        try {
            const userGoal = await this.collection().findOne({
                userId: new ObjectId(args.userId)
            });

            const latestLogs = await this.collectionProgress().find({
                userId: args.userId
            }).sort({ date: -1 }).limit(1).toArray();

            const currentWeight = latestLogs[0].weight
            const weightProgress = userGoal.goalWeight - latestLogs[0].weight
            const lastExerciseDate = new Date(latestLogs[0].date)
            const currentDate = new Date()
            const daysLastExercise = (new Date(currentDate) - new Date(lastExerciseDate)) / (1000 * 60 * 60 * 24);

            if (currentWeight !== userGoal.goalWeight) {
                const result = await analyticChat.sendMessage(`User Goal: ${userGoal.goalName}
                    Current Weight: ${currentWeight}
                    Goal Weight: ${userGoal.goalWeight}
                    Start Date: ${userGoal.startDate}
                    The user has not lost weight or hasn't gained weight and/or has not exercised recently. 
                    Please generate a list of 15-20 exercises for the user to help them break their plateau, continue losing weight, or gain weight. Make sure to structure the response in JSON format with fields: "description" and "exercises". Example:
                
                    {
                      "description": "description text here",
                      "exercises": ["exercise1", "exercise2", "exercise3", ...]
                    }`
                );
                

                // Get the response text
                const responseText = await result.response.text();

                const formattedResponse = {
                    success: true,
                    data: {
                        response: {
                            text: responseText
                        }
                    }
                };

                console.log("🚀 ~ UserGoalModel ~ giveAnalyticByAI ~ formattedResponse.data.response.text:", formattedResponse.data.response.text)
            } else {
                const result = await analyticChat.sendMessage(`User Goal: ${userGoal.goalName}
                    Current Weight: ${currentWeight}
                    Goal Weight: ${userGoal.goalWeight}
                    Start Date: ${userGoal.startDate}
                    The user already have a fit and reach the goal, but i thinks he want to updata the exercise right now. Make sure to structure the response in JSON format with fields: "description" and "exercises". Example:
                
                    {
                      "description": "description text here",
                      "exercises": ["exercise1", "exercise2", "exercise3", ...]
                    }`
                );
                

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

                console.log("🚀 ~ UserGoalModel ~ giveAnalyticByAI ~ Normal Weight:", formattedResponse.data.response.text)
            }



        } catch (error) {
            console.log("🚀 ~ UserGoalModel ~ giveAnalyticByAI ~ error:", error)
        }
    }

}

module.exports = UserGoalModel