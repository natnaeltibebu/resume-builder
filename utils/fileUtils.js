const fs = require('fs').promises;
const path = require('path');

const cleanupTempFiles = async () => {
    try {
        const tempDir = path.join(__dirname, '..', 'temp');
        const files = await fs.readdir(tempDir);
        
        // Delete files older than 1 hour
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        for (const file of files) {
            const filePath = path.join(tempDir, file);
            const stats = await fs.stat(filePath);
            
            if (stats.mtime.getTime() < oneHourAgo) {
                await fs.unlink(filePath);
                console.log(`Cleaned up temp file: ${file}`);
            }
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
};

module.exports = { cleanupTempFiles };