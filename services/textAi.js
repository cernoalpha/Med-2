const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const textAi = async (completeOCR)=>{

try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: "output: {\n  \"PatientInformation\": {\n    \"patientName\": \"\",\n    \"patientid\": \"\",\n    \"patientGender\": \"\",\n    \"patientAddress\": \"\",\n    \"patientContact\": \"\"\n  },\n  \"Prescription\": {\n    \"prescriptionNumber\": \"\",\n    \"prescriptionDate\": \"\",\n    \"medications\": [\n      {\"name\": \"\", \"dosage\": \"\", \"quantity\": \"\"}\n    ]\n  },\n  \"MedicalReport\": {\n   \"reportSummary\": \"\"\n    \"hospital\": \"\",\n    \"date\": \"\",\n    \"recordNumber\": \"\",\n    \"physician\": \"\",\n    \"tests\": [],\n   },\n  \"HospitalBill\": {\n    \"hospital\": \"\",\n    \"doctorName\": \"\",\n    \"date\": \"\",\n    \"medications\": [\n      {\"name\": \"\", \"dose\": \"\", \"duration\": \"\"}\n    ]\n  },\n  \"Insurance\": {\n    \"policy\": {\n      \"number\": \"\",\n      \"startDate\": \"\",\n      \"endDate\": \"\",\n      \"coverageType\": \"\",\n      \"coverageDetails\": {\n        \"inpatient\": \"\",\n        \"outpatient\": \"\",\n        \"prescriptionCoverage\": \"\"\n      },\n      \"deductible\": \"\",\n      \"insuranceProvider\": {\n        \"name\": \"\",\n        \"contact\": \"\",\n        \"address\": \"\"\n      },\n      \"services\": [\n        {\n          \"service\": \"\",\n          \"description\": \"\",\n          \"date\": \"\",\n          \"cptCode\": \"\",\n          \"charge\": \"\"\n        }\n      ],\n      \"charges\": {\n        \"total\": \"\",\n        \"insurancePayments\": \"\",\n        \"patientPayments\": \"\",\n        \"adjustments\": \"\"\n      },\n      \"provider\": {\n        \"name\": \"\",\n        \"address\": \"\",\n        \"contact\": \"\",\n        \"npi\": \"\"\n      }\n    }\n  },\n  \"PharmacyBill\": {\n    \"pharmacy\": {\n      \"name\": \"\",\n      \"id\": \"\",\n      \"address\": \"\",\n      \"contact\": \"\"\n    },\n    \"totalAmount\": \"\",\n    \"insuranceCoverage\": {\n      \"coveredAmount\": \"\",\n      \"patientResponsibility\": \"\"\n    },\n    \"payment\": {\n      \"method\": \"\",\n      \"transactionId\": \"\",\n      \"amount\": \"\",\n      \"date\": \"\"\n    }\n  }\n}",
    
            },
            {
                role: "model",
                parts: "output: {\n  \"PatientInformation\": {\n    \"patientName\": \"\",\n    \"patientid\": \"\",\n    \"patientGender\": \"\",\n    \"patientAddress\": \"\",\n    \"patientContact\": \"\"\n  },\n  \"Prescription\": {\n    \"prescriptionNumber\": \"\",\n    \"prescriptionDate\": \"\",\n    \"medications\": [\n      {\"name\": \"\", \"dosage\": \"\", \"quantity\": \"\"}\n    ]\n  },\n  \"MedicalReport\": {\n   \"reportSummary\": \"\"\n    \"hospital\": \"\",\n    \"date\": \"\",\n    \"recordNumber\": \"\",\n    \"physician\": \"\",\n    \"tests\": [],\n   },\n  \"HospitalBill\": {\n    \"hospital\": \"\",\n    \"doctorName\": \"\",\n    \"date\": \"\",\n    \"medications\": [\n      {\"name\": \"\", \"dose\": \"\", \"duration\": \"\"}\n    ]\n  },\n  \"Insurance\": {\n    \"policy\": {\n      \"number\": \"\",\n      \"startDate\": \"\",\n      \"endDate\": \"\",\n      \"coverageType\": \"\",\n      \"coverageDetails\": {\n        \"inpatient\": \"\",\n        \"outpatient\": \"\",\n        \"prescriptionCoverage\": \"\"\n      },\n      \"deductible\": \"\",\n      \"insuranceProvider\": {\n        \"name\": \"\",\n        \"contact\": \"\",\n        \"address\": \"\"\n      },\n      \"services\": [\n        {\n          \"service\": \"\",\n          \"description\": \"\",\n          \"date\": \"\",\n          \"cptCode\": \"\",\n          \"charge\": \"\"\n        }\n      ],\n      \"charges\": {\n        \"total\": \"\",\n        \"insurancePayments\": \"\",\n        \"patientPayments\": \"\",\n        \"adjustments\": \"\"\n      },\n      \"provider\": {\n        \"name\": \"\",\n        \"address\": \"\",\n        \"contact\": \"\",\n        \"npi\": \"\"\n      }\n    }\n  },\n  \"PharmacyBill\": {\n    \"pharmacy\": {\n      \"name\": \"\",\n      \"id\": \"\",\n      \"address\": \"\",\n      \"contact\": \"\"\n    },\n    \"totalAmount\": \"\",\n    \"insuranceCoverage\": {\n      \"coveredAmount\": \"\",\n      \"patientResponsibility\": \"\"\n    },\n    \"payment\": {\n      \"method\": \"\",\n      \"transactionId\": \"\",\n      \"amount\": \"\",\n      \"date\": \"\"\n    }\n  }\n}",
            },
            {
                role:"user",
                parts:completeOCR,
            },
            {
                role: "model",
                parts: "",
            },
        ],
        generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
        },
    });
    
    const msg = "\n\nRead the text and extract the details and fill the available details in the given format";
    
    const result = await chat.sendMessage(msg);
    const response = await result.response;

    return response.text();
    
} catch (error) {
    return { success: false, error: error.message };
}
}

module.exports = {textAi}

