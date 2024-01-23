//1, 2. Import all required modules (and define paths)
const fs = require('fs');
const path = require('path');
//where to put bundle
const projectDistPath = path.join(__dirname, 'project-dist');
//where to put index.html
const finalHTML = path.join(__dirname, 'project-dist', 'index.html');
//where is the template
const templatePath = path.join(__dirname, 'template.html');
//where are all html contents
const componentsPath = path.join(__dirname, 'components');

if (!fs.existsSync(projectDistPath)) {
  fs.mkdirSync(projectDistPath);
}

// 3. Find all tag names in the template file
let templateContent = fs.readFileSync(templatePath, 'utf-8');
const tagNames = templateContent
  .match(/{{(.*?)}}/g)
  .map((tag) => tag.replace(/[{}]/g, '').trim());
//find matching files
const matchingFiles = tagNames.map((tag) => {
  const filePath = path.join(componentsPath, `${tag}.html`);
  return fs.existsSync(filePath) ? filePath : null;
});
// 4. Replace template tags with the contents of component files
matchingFiles.forEach((filePath, index) => {
  if (filePath) {
    const componentContent = fs.readFileSync(filePath, 'utf-8');
    const tagRegex = new RegExp(`{{${tagNames[index]}}}`, 'g');
    templateContent = templateContent.replace(tagRegex, componentContent);
  }
});
// 5. Write the modified template to the index.html file in the project-dist folder
fs.writeFileSync(finalHTML, templateContent);

//6. Use the existing script from task 05-merge-styles to create the style.css file
const stylesFolderPath = path.join(__dirname, 'styles');
const finalStylesPath = path.join(__dirname, 'project-dist', 'style.css');

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
  fs.writeFileSync(finalStylesPath, bundleContent, 'utf-8');
  console.log('Style bundle created successfully:', finalStylesPath);
});

// 7. Use the script from task 04-copy-directory to move the assets folder into the project-dist folder

//*to be done*
