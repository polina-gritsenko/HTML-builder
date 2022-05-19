const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {stdout, stdin } = process;

const targetFilePath = path.join(__dirname, 'output.txt');

const fileStream = fs.createWriteStream(targetFilePath, {flags: 'a', encoding: 'utf-8'});

stdout.write('Enter some text..\n');
const rl = readline.createInterface( stdin, stdout );

rl.on('line', (input) => {
  fileStream.write(input, (err) => {if (err) return console.log(err);});
  fileStream.write('\n');
});

rl.on('close', () => {
  stdout.write('\nGood luck learning Node.js!');
  rl.close();
});