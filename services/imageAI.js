const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const fs = require('fs');
const path = require('path');
const { processPDF } = require('./pdfHandler');

const imageAi = async (req, res) => {
    try {
        const files = req.files;
        const fileProcessingPromises = [];

        files.forEach((file, index) => {
            console.log(`File ${index + 1}:`);
            console.log(`- Original Name: ${file.originalname}`);
            console.log(`- Size: ${file.size} bytes`);
            console.log(`- MIME Type: ${file.mimetype}`);
            console.log('------------------------');

            if (file.mimetype.startsWith('image/')) {
                const promise = processImage(file);
                fileProcessingPromises.push(promise);
            }
            else if (file.mimetype === 'application/pdf') {
                const promise = processPDF(file);
                fileProcessingPromises.push(promise);
            }
        });

        const fileProcessingResults = await Promise.all(fileProcessingPromises);
        const outputPath = path.join(__dirname, 'output.json');
        fs.writeFileSync(outputPath, JSON.stringify(fileProcessingResults, null, 2));


        res.status(200).json({ message: 'Files processed successfully', results: fileProcessingResults });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

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
            { text: "output: \n{\n    \"PatientInformation\": {\n        \"patientName\": \"\",\n        \"patientId\": \"\",\n        \"gender\": \"\",\n        \"address\": \"\",\n        \"contact\": \"\"\n    },\n    \n    \"Prescription\": {\n        \"prescriptionNumber\": \"\",\n        \"prescriberName\": \"\",\n        \"prescriptionDate\": \"\",\n        \"medications\": [\n            {\n                \"medicationName\": \"\",\n                \"dosage\": \"\",\n                \"quantity\": \"\",\n                \"unitPrice\": \"\",\n                \"totalPrice\": \"\"\n            }\n        ]\n    },\n    \"MedicalReport\": {\n        \"Hospital\": \"\",\n        \"Date\": \"\",\n        \"Gender\": \"\",\n        \"PatientName\": \"\",\n        \"Age\": \"\",\n        \"MedicalRecordNumber\": \"\",\n        \"Physician\": \"\",\n        \"LaboratoryTestsNames\": [],\n        \"ClinicalHistory\": \"\",\n        \"Analysis\":\"\"\n    },\n    \"HospitalBill\": {\n        \"Hospital\": \"\",\n        \"Doctor_name\": \"\",\n        \"Date\": \"\",\n        \"Gender\": \"\",\n        \"Patient_name\": \"\",\n        \"Medications\": [\n            {\n                \"Name\": \"\",\n                \"Dose\": \"\",\n                \"Duration\": \"\"\n            }\n        ]\n    },\n    \"Insurance\": {\n        \"policyHolder\": {\n            \"policyHolderName\": \"\",\n            \"policyHolderId\": \"\",\n            \"dob\": \"\",\n            \"gender\": \"\",\n            \"contact\": \"\",\n            \"address\": \"\"\n        },\n        \"policy\": {\n            \"policyNumber\": \"\",\n            \"startDate\": \"\",\n            \"endDate\": \"\",\n            \"coverageType\": \"\",\n            \"coverageDetails\": {\n                \"inpatient\": \"\",\n                \"outpatient\": \"\",\n                \"prescriptionCoverage\": \"\"\n            },\n            \"deductible\": \"\",\n            \"coPay\": {\n                \"inpatient\": \"\",\n                \"outpatient\": \"\"\n            },\n            \"maxCoverageAmount\": \"\"\n        },\n        \"dependents\": [\n            {\n                \"dependentName\": \"\",\n                \"relation\": \"\",\n                \"dob\": \"\"\n            }\n        ],\n        \"insuranceProvider\": {\n            \"providerName\": \"\",\n            \"contact\": \"\",\n            \"address\": \"\"\n        },\n        \"services\": [\n            {\n                \"service\": \"\",\n                \"description\": \"\",\n                \"date\": \"\",\n                \"cptCode\": \"\",\n                \"charge\": \"\"\n            }\n        ],\n        \"charges\": {\n            \"total\": \"\",\n            \"insurancePayments\": \"\",\n            \"patientPayments\": \"\",\n            \"adjustments\": \"\"\n        },\n        \"provider\": {\n            \"name\": \"\",\n            \"address\": \"\",\n            \"contact\": \"\",\n            \"npi\": \"\"\n        }\n    },\n    \"PharmacyBill\": {\n        \"patient\": {\n            \"patientName\": \"\",\n            \"patientId\": \"\",\n            \"gender\": \"\",\n            \"address\": \"\",\n            \"contact\": \"\"\n        },\n        \"pharmacy\": {\n            \"pharmacyName\": \"\",\n            \"pharmacyId\": \"\",\n            \"address\": \"\",\n            \"contact\": \"\"\n        },\n        \"totalAmount\": \"\",\n        \"insuranceCoverage\": {\n            \"coveredAmount\": \"\",\n            \"patientResponsibility\": \"\"\n        },\n        \"payment\": {\n            \"paymentMethod\": \"\",\n            \"transactionId\": \"\",\n            \"paymentAmount\": \"\",\n            \"paymentDate\": \"\"\n        }\n    }\n}" },
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


module.exports = { imageAi };
