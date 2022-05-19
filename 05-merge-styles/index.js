const path = require('path');
const { readdir, rm } = require('fs/promises');
const { stat, createReadStream, appendFile } = require('fs');

const entry = path.join(__dirname, 'styles');
const dist = path.join(__dirname, 'project-dist');
const bundle = path.join(dist, 'bundle.css');

(async () => {
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
})();