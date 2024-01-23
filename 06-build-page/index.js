const fs = require('fs').promises;
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const finalHTML = path.join(projectDistPath, 'index.html');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesFolderPath = path.join(__dirname, 'styles');
const finalStylesPath = path.join(projectDistPath, 'style.css');
const assetsPath = path.join(__dirname, 'assets');
const finalAssetsPath = path.join(projectDistPath, 'assets');

async function createDirectory(directoryPath) {
  try {
    await fs.mkdir(directoryPath, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${directoryPath}:`, error.message);
  }
}

async function readAndReplaceTemplate(templatePath, componentsPath) {
  try {
    let templateContent = await fs.readFile(templatePath, 'utf-8');
    const tagNames = templateContent
      .match(/{{(.*?)}}/g)
      .map((tag) => tag.replace(/[{}]/g, '').trim());

    const matchingFiles = await Promise.all(
      tagNames.map(async (tag) => {
        const filePath = path.join(componentsPath, `${tag}.html`);
        return await fs
          .access(filePath)
          .then(() => filePath)
          .catch(() => null);
      }),
    );

    await Promise.all(
      matchingFiles.filter(Boolean).map(async (filePath, index) => {
        const componentContent = await fs.readFile(filePath, 'utf-8');
        const tagRegex = new RegExp(`{{${tagNames[index]}}}`, 'g');
        templateContent = templateContent.replace(tagRegex, componentContent);
      }),
    );

    await fs.writeFile(finalHTML, templateContent);
  } catch (error) {
    console.error('Error reading and replacing template:', error.message);
  }
}

async function mergeStyles(stylesFolderPath, finalStylesPath) {
  try {
    const files = await fs.readdir(stylesFolderPath);
    const cssFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === '.css',
    );

    const stylesArray = await Promise.all(
      cssFiles.map(async (cssFile) => {
        const filePath = path.join(stylesFolderPath, cssFile);
        return await fs.readFile(filePath, 'utf-8');
      }),
    );

    const bundleContent = stylesArray.join('\n');
    await fs.writeFile(finalStylesPath, bundleContent, 'utf-8');
    console.log('Style bundle created successfully:', finalStylesPath);
  } catch (error) {
    console.error('Error merging styles:', error.message);
  }
}

async function copyDirectory(srcPath, dest) {
  try {
    await createDirectory(dest);

    const files = await fs.readdir(srcPath);
    await Promise.all(
      files.map(async (file) => {
        const sourceFilePath = path.join(srcPath, file);
        const destinationFilePath = path.join(dest, file);
        const stats = await fs.stat(sourceFilePath);

        if (stats.isDirectory()) {
          await copyDirectory(sourceFilePath, destinationFilePath);
        } else {
          await fs.copyFile(sourceFilePath, destinationFilePath);
        }
      }),
    );
  } catch (error) {
    console.error('Error copying directory:', error.message);
  }
}

async function main() {
  await createDirectory(projectDistPath);
  await readAndReplaceTemplate(templatePath, componentsPath);
  await mergeStyles(stylesFolderPath, finalStylesPath);
  await copyDirectory(assetsPath, finalAssetsPath);
}

main();
