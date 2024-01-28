// pdfHandler.js
const fs = require('fs');
const path = require('path');
const Pdf2Img = require('pdf2img-promises');
const { processImage } = require('./imageProcessor');

const processPDF = async (file) => {
    try {
        const outputPath = path.join(__dirname, 'temp');
        const pdfPath = path.join(outputPath, file.originalname);

        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }
        fs.writeFileSync(pdfPath, file.buffer);

        const fileName = path.parse(file.originalname).name;
        const outputDir = path.join(__dirname, 'output');

        const converter = new Pdf2Img();

        converter.on(fileName, (msg) => {
            console.log('Received: ', msg);
        });

        converter.setOptions({
            type: 'png',
            size: 1024,
            density: 600,
            quality: 80,
            outputdir: outputDir,
            outputname: fileName,
            page: null, 
        });

        const info = await converter.convert(pdfPath);
        fs.unlinkSync(pdfPath);

        const imageProcessingPromises = info.map(async (imageInfo, pageIndex) => {
            const imagePath = path.join(outputDir, `${fileName}-${pageIndex + 1}.png`);
            const imageFile = {
                buffer: fs.readFileSync(imagePath),
                mimetype: 'image/png',
                originalname: `${fileName}-${pageIndex + 1}.png`,
            };

            return processImage(imageFile);
        });

        const pdfProcessingResults = await Promise.all(imageProcessingPromises);

        info.forEach((imageInfo, pageIndex) => {
            const imagePath = path.join(outputDir, `${fileName}-${pageIndex + 1}.png`);
            fs.unlinkSync(imagePath);
        });

        return pdfProcessingResults;

    } catch (error) {
        return { success: false, error: error.message };
    }
};

module.exports = { processPDF };
