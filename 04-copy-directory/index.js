const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  try {
    const destinationFolder = path.join(__dirname, 'files-copy');
    await fs.mkdir(destinationFolder, { recursive: true });

    const sourceFolder = path.join(__dirname, 'files');
    const files = await fs.readdir(sourceFolder);

    for (const file of files) {
      const sourceFilePath = path.join(sourceFolder, file);
      const destinationFilePath = path.join(destinationFolder, file);

      await fs.copyFile(sourceFilePath, destinationFilePath);
    }
  } catch (error) {
    console.error('Error copying directory:', error.message);
  }
}

copyDir();
