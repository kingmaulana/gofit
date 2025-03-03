// const { chatSession } = require('./AIModal');

// async function testChatSession() {
//     try {
//         // Send the message to the chat session
//         const result = await chatSession.sendMessage("Make a list of thing i do if im a monster ?");
//         const responseText = await result.response.text();

//         // Log the full response to understand the structure of candidates
//         console.log("Full response from chat session:", result);

//         const formattedResponse = {
//             success: true,
//             data: {
//                 response: {
//                     text: responseText
//                 }
//             }
//         };
//         console.log("🚀 ~ testChatSession ~ formattedResponse:", formattedResponse)
//     } catch (error) {
//         console.error("Error during chat session:", error);
//     }
// }



// module.exports = { testChatSession };