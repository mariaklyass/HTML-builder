const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

const pathFolderDist = path.join(__dirname, 'project-dist');
const pathTemplateFile = path.join(__dirname, 'template.html');
const pathHtmlFile = path.join(pathFolderDist, 'index.html');
const pathFolderStyles = path.join(__dirname, 'styles');
const pathFileStyles = path.join(pathFolderDist, 'style.css');
const pathFolderAssets = path.join(__dirname, 'assets');
const pathFolderAssetsCopy = path.join(pathFolderDist, 'assets');
const pathFolderComponents = path.join(__dirname, 'components');

const createDir = async () => {
  try {
    await fsPromises.rm(pathFolderDist, { recursive: true, force: true });
    await fsPromises.mkdir(pathFolderDist, { recursive: true });

    await copyFolder(pathFolderAssets, pathFolderAssetsCopy);
    await bundleHtml();
    await bundleCSS();

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Error during build:', error.message);
  }
};

const copyFolder = async (folder, copyFold) => {
  try {
    await fsPromises.rm(copyFold, { recursive: true, force: true });
    await fsPromises.mkdir(copyFold, { recursive: true });

    const files = await fsPromises.readdir(folder, { withFileTypes: true });

    const copyPromises = files.map(async (file) => {
      const pathFile = path.join(folder, file.name);
      const pathFileCopy = path.join(copyFold, file.name);

      if (file.isDirectory()) {
        await copyFolder(pathFile, pathFileCopy);
      } else {
        await fsPromises.copyFile(pathFile, pathFileCopy);
      }
    });

    await Promise.all(copyPromises);
  } catch (error) {
    console.error('Error during folder copy:', error.message);
  }
};

const bundleHtml = async () => {
  try {
    const files = await fsPromises.readdir(pathFolderComponents, {
      withFileTypes: true,
    });
    let str = await fsPromises.readFile(pathTemplateFile, 'utf-8');

    const promises = files.map(async (file) => {
      const nameComponent = path.parse(file.name).name;
      const fileComponent = path.join(pathFolderComponents, file.name);

      const readComponent = await fsPromises.readFile(fileComponent, 'utf-8');
      str = str.replaceAll(`{{${nameComponent}}}`, readComponent);
    });

    await Promise.all(promises);
    await fsPromises.writeFile(pathHtmlFile, str);
  } catch (error) {
    console.error('Error during HTML bundling:', error.message);
  }
};

const bundleCSS = async () => {
  try {
    const files = await fsPromises.readdir(pathFolderStyles, {
      withFileTypes: true,
    });
    const writeStream = fs.createWriteStream(pathFileStyles);

    files.forEach((file) => {
      if (file.isFile() && path.parse(file.name).ext === '.css') {
        const pathFile = path.join(pathFolderStyles, file.name);
        const readStream = fs.createReadStream(pathFile, 'utf-8');
        readStream.pipe(writeStream, { end: false });
      }
    });

    writeStream.end();
  } catch (error) {
    console.error('Error during CSS bundling:', error.message);
  }
};

createDir();
