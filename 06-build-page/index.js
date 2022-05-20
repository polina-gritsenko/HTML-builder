const path = require('path');
const { readdir, rm, mkdir, copyFile, readFile, writeFile } = require('fs/promises');
const { stat, createReadStream, appendFile,  } = require('fs');

const dist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');

async function createFolder(folder) {
  try {
    await rm(folder, {force: true, recursive: true});
    await mkdir(folder, {recursive: true});       
  } catch (err) {
    console.error(err);
  }
}

async function processTemplateFile() {
  try {
    let template = await readFile(templatePath,'utf8');
    const files = await readdir(componentsPath);
    
    for (const file of files) {
      const fileName = path.basename(file, '.html');
      const fileContent = await readFile(path.join(componentsPath, file), 'utf8');
      template = template.replace(`{{${fileName}}}`, fileContent);
    }     

    await writeFile(path.join(dist, 'index.html'), template);
  } catch (err) {
    console.error(err);
  }
}
async function mergeStyles() {
  const entry = path.join(__dirname, 'styles');
  const bundle = path.join(dist, 'style.css');
    
  try {
    await rm(bundle, {force: true});
    const files = await readdir(entry);
    
    for (const file of files)
      stat(path.join(entry, file), (err, stats)=> {
        if (err) throw err;
        if(stats.isFile() && path.extname(file) === '.css') {
          const filePath = path.join(entry, file);
          const readable = createReadStream(filePath, 'utf-8');
          readable.on('data', (data) => {
            appendFile(bundle, `${data}\n`, function (err) {
              if (err) throw err;
            });
          });          
        }
      });     
  } catch (err) {
    console.error(err);
  }
}

async function copyDir(relativeDirectoryToCopy) {
  const folderToCopyName = relativeDirectoryToCopy.split(path.sep).at(-1);
  const targetFolder = path.join(dist, relativeDirectoryToCopy);
  const directoryToCopy = path.join(__dirname, relativeDirectoryToCopy);

  await createFolder(targetFolder);

  try {  
    const files = await readdir(directoryToCopy);    

    for (const file of files) {
      stat(path.join(directoryToCopy, file), (err, stats)=> {
        if (err) throw err;
        if(stats.isFile()){
          copyFile(path.join(directoryToCopy, file), path.join(targetFolder, file));
        }
        else {
          copyDir(path.join(folderToCopyName, file));
        }
      });
      
    }          
  } catch (err) {
    console.error(err);
  }
}

createFolder(dist).then (()=> {
  mergeStyles();
  copyDir('assets');
  processTemplateFile();
});