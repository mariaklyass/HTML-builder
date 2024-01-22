const fs = require('fs/promises');
const path = require('path');
const folderPath = './03-files-in-folder/secret-folder';

async function displayFileInfo() {
  try {
    const folderContents = await fs.readdir(folderPath, {
      withFileTypes: true,
    });

    for (const item of folderContents) {
      if (item.isFile()) {
        const filePath = path.join(folderPath, item.name);

        const fileStats = await fs.stat(filePath);

        const fileExtension = path.extname(item.name).slice(1);

        console.log(
          `${path.parse(item.name).name} - ${fileExtension} - ${
            fileStats.size
          } bytes`,
        );
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

displayFileInfo();
