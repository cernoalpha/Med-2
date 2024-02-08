const sharp = require('sharp');

async function compressImages(imageBuffer) {
    try {

        const compressedImage = await sharp(imageBuffer)
            .resize({ width: 800 }) 
            .jpeg({ quality: 90 }) 
            .toBuffer({ resolveWithObject: true });

        console.log("Compression Complete")
        console.log(compressedImage.data)
        return compressedImage.data;
    } catch (error) {
        console.error('Error compressing image:', error);
        throw error; 
    }
}

module.exports = {compressImages};
