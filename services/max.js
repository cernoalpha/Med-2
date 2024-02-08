const clusterFiles = (files) => {
    const fileData = files.map(file => ({
        data: file.toString('base64'),
        size: file.length
    }));

    fileData.sort((a, b) => b.size - a.size);

    const maxClusterSize = 2.8 * 1024 * 1024;
    const maxImagesPerCluster = 16;
    const clusters = [];

    for (const file of fileData) {
        let clusterFound = false;
        for (const cluster of clusters) {
            if (cluster.size + file.size <= maxClusterSize && cluster.files.length < maxImagesPerCluster) {
                cluster.files.push(file.data); 
                cluster.size += file.size;
                clusterFound = true;
                break;
            }
        }
        if (!clusterFound) {
            clusters.push({ files: [file.data], size: file.size });
        }
    }

    return clusters;
}

module.exports = { clusterFiles };
