const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const outputFolderPath = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputFolderPath, 'bundle.css');

fs.readdir(stylesFolderPath, (err, files) => {
  if (err) {
    console.error('Error reading styles folder:', err);
    return;
  }
  const cssFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === '.css',
  );
  const stylesArray = [];
  cssFiles.forEach((cssFile) => {
    const filePath = path.join(stylesFolderPath, cssFile);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    stylesArray.push(fileContent);
  });
  const bundleContent = stylesArray.join('\n');
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath);
  }

  fs.writeFileSync(outputFile, bundleContent, 'utf-8');
  console.log('Bundle created successfully:', outputFile);
});
