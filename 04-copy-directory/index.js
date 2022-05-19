const path = require('path');
const { mkdir, copyFile, readdir, rm } = require('fs/promises');

async function copyDir() {
  const inputPath = path.join(__dirname, 'files');
  const outputPath = path.join(__dirname, 'files-copy');
  try {
    await rm(outputPath, {force: true, recursive: true});
    await mkdir(outputPath, {recursive: true});

    const files = await readdir(inputPath);
    for (const file of files) {
      await copyFile(path.join(inputPath, file), path.join(outputPath, file));
    } 
       
  } catch (err) {
    console.error(err);
  }
}

copyDir();