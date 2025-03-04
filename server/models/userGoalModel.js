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
        const result = await this.collection().aggregate([
            {
                // Match the goal by the provided userId
                $match: {
                    userId: new ObjectId(args.userId)
                }
            },
            {
                // Lookup to join the exercise collection
                $lookup: {
                    from: "exercise", // The name of the exercise collection
                    let: { exercises: "$exercise.exercise" }, // Reference the exercise array from the goal document
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$id", "$$exercises"] // Match exercise ids in the exercises array
                                }
                            }
                        }
                    ],
                    as: "completeExercise" // Name of the new array field that will hold the exercise details
                }
            },
            // {
            //     // Optionally, unwind the exerciseDetails array if you want them to be in a flat structure
            //     $unwind: {
            //         path: "$exerciseDetails",
            //         preserveNullAndEmptyArrays: true // Keep the structure even if no exercises are found
            //     }
            // }
        ]).toArray();
    
        console.log("🚀 ~ UserGoalModel ~ findGoal ~ result:", result[0]);
    
        // if (result.length > 0) {
        //     // Accessing the exercise details
        //     const exerciseDetails = result[0].exerciseDetails;
        //     console.log("Exercise Details:", exerciseDetails);
        //     return exerciseDetails;
        // } else {
        //     console.log("No goal found for the given userId.");
        //     return null;
        // }
        return result[0];
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
        // console.log("🚀 ~ UserGoalModel ~ createSuggestionAI ~ args:", args)
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
            const result = await chatSession.sendMessage(`Based on my data: ${DATA_EXERCISE}, provide 10-15 exercise recommendations for ${args.goalName}. I have a leg injury, weigh ${args.weight}, and my goal weight is ${args.goalWeight}. My gender is ${args.gender}, and my activity level is ${args.activity}. Structure the response in JSON with 'duration' (less than 200 seconds) and 'exercise' (list of recommended exercises). Example:
            {
            'duration': number,
            'exercise': ['exercise1', 'exercise2', 'exercise3', ...]
            }
            ` );
            // console.log("🚀 ~ UserGoalModel ~ createSuggestionAI ~ result:", result)
    
            // Get the response text
            const responseText = await result.response.text();
            // console.log("🚀 ~ UserGoalModel ~ createSuggestionAI ~ responseText:", responseText)
    
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
            // console.log("🚀 ~ testChatSession ~ jsonResponse:", jsonResponse);
    
            // Extract the duration and exercises from the response
            const { duration, exercises } = jsonResponse;
    
            // Ensure the duration is valid and exercises is an array
            if (typeof duration === 'number' && Array.isArray(exercises)) {
                // Create the ExerciseAI object
                const exerciseAI = {
                    exercise: exercises,
                    duration: duration
                };
    
                // Push exercises into the userGoal's exercise array, ensuring no duplicates
                await this.collection().updateOne(
                    { userId: new ObjectId(args.userId) },
                    { $set: { exercise: exerciseAI } }  // Update the whole exercise field
                );
                
                // Optional: Log the update result
                // console.log("Updated UserGoal:", userGoal);
    
                // Return a success response
                return { success: true, message: "Exercises updated successfully" };
            } else {
                throw new Error("Invalid response format. 'duration' and 'exercise' are required.");
            }
    
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