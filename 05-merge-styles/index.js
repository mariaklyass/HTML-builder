const fs = require('fs').promises;
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const outputFolderPath = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputFolderPath, 'bundle.css');

async function bundleStyles() {
  try {
    const files = await fs.readdir(stylesFolderPath);
    const cssFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === '.css',
    );
    const stylesArray = await Promise.all(
      cssFiles.map(async (cssFile) => {
        const filePath = path.join(stylesFolderPath, cssFile);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent;
      }),
    );

    const bundleContent = stylesArray.join('\n');

    try {
      await fs.mkdir(outputFolderPath);
    } catch (mkdirErr) {
      if (mkdirErr.code !== 'EEXIST') {
        console.error(
          `Error creating directory ${outputFolderPath}:`,
          mkdirErr,
        );
        throw mkdirErr;
      }
    }

    await fs.writeFile(outputFile, bundleContent, 'utf-8');
  } catch (err) {
    console.error('Error reading or writing files: ', err);
  }
}
bundleStyles();
