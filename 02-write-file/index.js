const fs = require('fs');
const readline = require('readline');

const outputFile = './02-write-file/output.txt';
const writableStream = fs.createWriteStream(outputFile, { flags: 'a' });

console.log('Welcome! Enter your text below (type "exit" to end):');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Thank you for your input and goodbye!');
    writableStream.end();
    rl.close();
  } else {
    writableStream.write(`${input}\n`);
    console.log('Text entered. Enter more text or type "exit" to end:');
  }
});

process.on('SIGINT', () => {
  console.log('/nThank you for your input and goodbye!');
  writableStream.end();
  rl.close();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('\nThank you for your input!');
  writableStream.end();
  rl.close();
  process.exit();
});
