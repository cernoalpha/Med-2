// imageProcessor.js
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const processImage = async (file) => {
    try {
        const extension = file.originalname.split('.').pop();
        const base64Data = file.buffer.toString('base64');

        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const generationConfig = {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
        };

        const parts = [
            { text: "input: Read the medical details and fill in the given format" },
            { text: "output: \n{\n    \"PatientInformation\": {\n        \"patientName\": \"\",\n        \"patientId\": \"\",\n        \"gender\": \"\",\n        \"address\": \"\",\n        \"contact\": \"\"\n    },\n    // ... (rest of the template)" },
            {
                inlineData: {
                    mimeType: `image/${extension}`,
                    data: base64Data
                }
            },
            { text: "input:\n Read the medical details and fill in the given format" },
        ];

        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
        });

        return { success: true, text: result.response.text() };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

module.exports = { processImage };
