const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, 'text.txt');
const readable = getReadableStream();
readable.on('data', (data) => {
  console.log(data);
});

// creates and returns an instance of fs.ReadStream class
function getReadableStream() {
  return fs.createReadStream(targetFilePath, 'utf-8');
}