const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, 'text.txt');
const readable = getReadableStream();
readable.on('data', (data) => {
  console.log(data);
});

function getReadableStream() {
  return fs.createReadStream(targetFilePath, 'utf-8');
}