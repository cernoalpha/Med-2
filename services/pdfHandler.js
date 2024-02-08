// pdfHandler.js
const fs = require('fs');
const path = require('path');
const {fromBuffer} = require('pdf2pic');
const { compressImages } = require('./compressImages')

const processPDF = async (file) => {
    try {
        const pdfBuffer = file.buffer;

        const outputPath = path.join(__dirname, 'output');
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }

        const options = {
            density: 600,           // dpi
            quality: 70,            // quality of the image
            outputFormat: 'png',    // output format
            size: 1024,             // size in pixels
        };

        const convert = fromBuffer(pdfBuffer, options);
        const imageFiles = await convert.bulk(-1,{ responseType: "base64" });
    
        const compressPromises = imageFiles.map(async (imageInfo) => {
            const base64String = imageInfo.base64;
            const buffer = Buffer.from(base64String, 'base64');
            if (buffer.length < 500 * 1024) {
                return buffer;
            } else {
                return await compressImages(buffer);
            }
        });
        

        const results = await Promise.all(compressPromises);

        fs.readdirSync(outputPath).forEach((file) => {
            const imagePath = path.join(outputPath, file);
            fs.unlinkSync(imagePath);
        });
        return results;

    } catch (error) {
        return { success: false, error: error.message };
    }
};

module.exports = { processPDF };
