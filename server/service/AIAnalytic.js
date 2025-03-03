const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

const analyticChat = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                {
                    text: "User Goal: lost-weight Current Weight: 70 Goal Weight: 82 Start Date: 20 march 2025 The user has not lost weight or hasn't gained weight and/or has not exercised recently. Please provide a list of new, more intense exercises to help the user break their plateau and continue losing weight or add weight.",
                },
            ],
        },
        {
            role: "model",
            parts: [
                {
                    text: "```json\n{\n  \"description\": \"You’re aiming for a weight gain of 12 kg to reach 82 kg, but you’re currently at a plateau with no recent weight change or exercise. To break this, focus on strength training with heavy lifting and compound movements to build muscle, and add HIIT and plyometric exercises like sprints, burpees, and jump squats to increase intensity and boost metabolism. Additionally, ensure you're in a caloric surplus with a higher protein intake to support muscle growth. By intensifying your workouts and adjusting your nutrition, you’ll get back on track towards your weight goal.\",\n  \"exercises\": [\n    \"Standing_One-Arm_Dumbbell_Triceps_Extension\",\n    \"One_Arm_Lat_Pulldown\",\n    \"Cable_One_Arm_Tricep_Extension\",\n    \"Sled_Overhead_Triceps_Extension\",\n    \"Kneeling_Forearm_Stretch\",\n    \"Overhead_Cable_Curl\",\n    \"Lying_T-Bar_Row\",\n    \"Bench_Press_with_Chains\",\n    \"Press_Sit-Up\",\n    \"Standing_Palms-Up_Barbell_Behind_The_Back_Wrist_Curl\",\n    \"Seated_Palms-Down_Barbell_Wrist_Curl\",\n    \"Incline_Cable_Flye\",\n    \"Close-Grip_Front_Lat_Pulldown\",\n    \"Supine_Chest_Throw\",\n    \"Elevated_Cable_Rows\",\n    \"Decline_EZ_Bar_Triceps_Extension\",\n    \"Smith_Machine_Decline_Press\",\n    \"Incline_Push-Up_Close-Grip\",\n    \"Standing_Towel_Triceps_Extension\",\n    \"Around_The_Worlds\",\n    \"Single_Dumbbell_Raise\"\n  ]\n}\n```"
                }
            ]
        }
    ]
});

module.exports = { analyticChat };
