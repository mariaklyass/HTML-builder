//1. Import all required modules.
const fs = require('fs');
const path = require('path');

// 2. Find all tag names in the template file
//?

// 3. Replace template tags with the contents of component files
//?

// 4. Write the modified template to the index.html file in the project-dist folder
const projectDistPath = path.join(__dirname, 'project-dist');
const indexPath = path.join(projectDistPath, 'index.html');
fs.mkdirSync(projectDistPath, { recursive: true });

//  5. Write the modified template to the `index.html` file in the `project-dist` folder.

//6. Use the existing script from task 05-merge-styles to create the style.css file
const stylesFolderPath = path.join(__dirname, 'styles');
const stylePath = path.join(projectDistPath, 'style.css');

// 7. Use the script from task 04-copy-directory to move the assets folder into the project-dist folder
const copyDirectory = require('../04-copy-directory');
const assetsSrc = path.join(__dirname, 'assets');
const assetsDest = path.join(projectDistPath, 'assets');
copyDirectory(assetsSrc, assetsDest);

//*to be done*
