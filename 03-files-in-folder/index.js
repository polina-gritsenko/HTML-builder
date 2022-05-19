const path = require('path');
const { readdir } = require('fs/promises');
const { stat } = require('fs');

const folderPath = path.join(__dirname, 'secret-folder');

(async function(filePath) {
  try {
    const files = await readdir(filePath);
    for (const file of files)
      stat(path.join(filePath, file), (err, stats)=> {
        if(stats.isFile()) {
          const {size: file1Size } = stats;
          const message = `${path.parse(file).name} - ${path.extname(file).substring(1)} - ${file1Size/1024}kb`;
          console.log(message);
        }
      });          
  } catch (err) {
    console.error(err);
  }
})(folderPath);
