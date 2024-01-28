try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: "output: {\n    \"Hospital\": \"\",\n    \"Doctor_name\":\"\",\n    \"Date\": \"\",\n    \"Gender\": \"\",\n    \"Age\": \"\",\n    \"Patient_name\": \"\",\n    \"Medications\": [\n        {\n            \"Name\": \"\",\n            \"Dose\": \"\",\n            \"Duration\": \"\"\n        }\n    ]\n}",
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
    
    const msg = pdfData +"\nRead the medical details and fill in the given format";
    
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    
    res.json({ success: true, text });
    
} catch (error) {
    res.status(500).json({ success: false, error: error.message });
}
