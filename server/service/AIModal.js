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

const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                {
                    text: "if i send that data to you and i want you to make a recomended 15 -20 exercise for user want to lose weight, with injurie in leg.",
                },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n{\n  \"exercises\": [\n    \"Standing_One-Arm_Dumbbell_Triceps_Extension\",\n    \"One_Arm_Lat_Pulldown\",\n    \"Cable_One_Arm_Tricep_Extension\",\n    \"Sled_Overhead_Triceps_Extension\",\n    \"Kneeling_Forearm_Stretch\",\n    \"Overhead_Cable_Curl\",\n    \"Lying_T-Bar_Row\",\n    \"Bench_Press_with_Chains\",\n    \"Press_Sit-Up\",\n    \"Standing_Palms-Up_Barbell_Behind_The_Back_Wrist_Curl\",\n    \"Seated_Palms-Down_Barbell_Wrist_Curl\",\n    \"Incline_Cable_Flye\",\n    \"Close-Grip_Front_Lat_Pulldown\",\n    \"Supine_Chest_Throw\",\n    \"Elevated_Cable_Rows\",\n    \"Decline_EZ_Bar_Triceps_Extension\",\n    \"Smith_Machine_Decline_Press\",\n    \"Incline_Push-Up_Close-Grip\",\n    \"Standing_Towel_Triceps_Extension\",\n    \"Around_The_Worlds\",\n    \"Single_Dumbbell_Raise\"\n  ]\n}\n```" }
            ]
        }
    ]
});

module.exports = { chatSession };
