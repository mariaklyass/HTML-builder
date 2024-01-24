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

    const destinationFiles = await fs.readdir(destinationFolder);

    for (const destFile of destinationFiles) {
      const sourceFileExists = files.includes(destFile);

      if (!sourceFileExists) {
        const filePathToDelete = path.join(destinationFolder, destFile);
        await fs.unlink(filePathToDelete);
      }
    }
  } catch (error) {
    console.error('Error copying directory:', error.message);
  }
}

copyDir();
