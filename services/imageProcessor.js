const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);



const processImage = async (clusters) => {
    const results = [];
    try {
        
        for (const cluster of clusters) {
            const clusterObject = {
                parts: [],
            };
            clusterObject.parts.push({ text: "output: {\n  \"PatientInformation\": {\n    \"patientName\": \"\",\n    \"patientid\": \"\",\n    \"patientGender\": \"\",\n    \"patientAddress\": \"\",\n    \"patientContact\": \"\"\n  },\n  \"Prescription\": {\n    \"prescriptionNumber\": \"\",\n    \"prescriptionDate\": \"\",\n    \"medications\": [\n      {\"name\": \"\", \"dosage\": \"\", \"quantity\": \"\"}\n    ]\n  },\n  \"MedicalReport\": {\n   \"reportSummary\": \"\"\n    \"hospital\": \"\",\n    \"date\": \"\",\n    \"recordNumber\": \"\",\n    \"physician\": \"\",\n    \"tests\": [],\n   },\n  \"HospitalBill\": {\n    \"hospital\": \"\",\n    \"doctorName\": \"\",\n    \"date\": \"\",\n    \"medications\": [\n      {\"name\": \"\", \"dose\": \"\", \"duration\": \"\"}\n    ]\n  },\n  \"Insurance\": {\n    \"policy\": {\n      \"number\": \"\",\n      \"startDate\": \"\",\n      \"endDate\": \"\",\n      \"coverageType\": \"\",\n      \"coverageDetails\": {\n        \"inpatient\": \"\",\n        \"outpatient\": \"\",\n        \"prescriptionCoverage\": \"\"\n      },\n      \"deductible\": \"\",\n      \"insuranceProvider\": {\n        \"name\": \"\",\n        \"contact\": \"\",\n        \"address\": \"\"\n      },\n      \"services\": [\n        {\n          \"service\": \"\",\n          \"description\": \"\",\n          \"date\": \"\",\n          \"cptCode\": \"\",\n          \"charge\": \"\"\n        }\n      ],\n      \"charges\": {\n        \"total\": \"\",\n        \"insurancePayments\": \"\",\n        \"patientPayments\": \"\",\n        \"adjustments\": \"\"\n      },\n      \"provider\": {\n        \"name\": \"\",\n        \"address\": \"\",\n        \"contact\": \"\",\n        \"npi\": \"\"\n      }\n    }\n  },\n  \"PharmacyBill\": {\n    \"pharmacy\": {\n      \"name\": \"\",\n      \"id\": \"\",\n      \"address\": \"\",\n      \"contact\": \"\"\n    },\n    \"totalAmount\": \"\",\n    \"insuranceCoverage\": {\n      \"coveredAmount\": \"\",\n      \"patientResponsibility\": \"\"\n    },\n    \"payment\": {\n      \"method\": \"\",\n      \"transactionId\": \"\",\n      \"amount\": \"\",\n      \"date\": \"\"\n    }\n  }\n}" });
            
            for (const file of cluster.files) {
                const base64Data = file;
                const extension = 'jpeg';

                clusterObject.parts.push({
                    inlineData: {
                        mimeType: `image/${extension}`,
                        data: base64Data
                    }
                });
            }

            clusterObject.parts.push({ text: "input:\n Read the medical details and fill in the given correct json format " });

            const size = JSON.stringify(clusterObject).length / (1024 * 1024); 
            console.log(`Cluster size:`, size);
            results.push(clusterObject);
        }
    } catch (clusterError) {
        throw new Error(`Error processing clusters: ${clusterError.message}`);
    }

    try {
    const geminiRequests = results.map(async (result) => {
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const generationConfig = {
            temperature: 0.2,
            topK: 32,
            topP: 1,
            maxOutputTokens: 10000,
        };

        // const safetySettings = [
        //     {
        //         category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        //         threshold: HarmBlockThreshold.BLOCK_NONE,
        //     },
        //     {
        //         category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        //         threshold: HarmBlockThreshold.BLOCK_NONE,
        //     },
        //     {
        //         category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        //         threshold: HarmBlockThreshold.BLOCK_NONE,
        //     },
        //     {
        //         category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        //         threshold: HarmBlockThreshold.BLOCK_NONE,
        //     },
        // ];

        const parts = result.parts;

        const gemeniResponse = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            // safetySettings
        });
        return gemeniResponse.response.text()
    })
    const geminiResponses = await Promise.all(geminiRequests);
    return geminiResponses;

} catch (error) {
    return { success: false, error: error.message };
}
    };

module.exports = { processImage };

