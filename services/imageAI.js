const { processImage } = require('./imageProcessor')
const { processPDF } = require('./pdfHandler')
const { textAi } = require('./textAi');
const {combine} = require('./comboAll')
const { clusterFiles } = require('./max')
const { compressImages } = require('./compressImages')


const imageAi = async (req, res) => {
    try {
        const files = req.files;
        const fileProcessingPromises = [];
        const compressedImages = [];

        files.forEach((file, index) => {
            console.log(`File ${index + 1}:`);
            console.log(`- Original Name: ${file.originalname}`);
            console.log(`- Size: ${file.size} bytes`);
            console.log(`- MIME Type: ${file.mimetype}`);
            console.log('------------------------');

            if (file.mimetype.startsWith('image/')) {
                const imageBuffer = file.buffer;
                if (file.size <= 750 * 1024) {
                    compressedImages.push(imageBuffer)
                } else {
                    const promise = compressImages(imageBuffer);
                    fileProcessingPromises.push(promise);
                }
            }
            else if (file.mimetype === 'application/pdf') {
                const promise = processPDF(file);
                fileProcessingPromises.push(promise);
            }
        });

        const fileProcessingResults = await Promise.all(fileProcessingPromises);

        fileProcessingResults.forEach(result => {
            if (Array.isArray(result)) {
                compressedImages.push(...result);
            } else {
                compressedImages.push(result);
            }
        });

        const clusteredFiles = await clusterFiles(compressedImages);
        const imageResponse = await processImage(clusteredFiles)
        // console.log(imageResponse)
        const response = combine(imageResponse)
        res.status(200).json(response);
        // res.status(200).json({ message: imageResponse });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { imageAi };
