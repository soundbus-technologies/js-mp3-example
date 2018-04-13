var fs = require('fs');
var Mp3 = require('js-mp3');
var wav = require('wav');
var Speaker = require('speaker');
var arrayBufferToBuffer = require('arraybuffer-to-buffer');

const decodedFile = './classic_01.wav';
const fileToDecode = './classic_01.mp3';

var ab = fs.readFileSync(fileToDecode, null).buffer;

console.log('Start to decode file: ' + fileToDecode);
var d = Mp3.newDecoder(ab);
var pcm_ab = d.decode();
console.log('Decode finished. Decoded wav file: ' + decodedFile);
var b = arrayBufferToBuffer(pcm_ab);

var nch = d.frame.header.numberOfChannels();
var fwriter = new wav.FileWriter(decodedFile, {
    channels: nch
});
fwriter.write(b);

var file = fs.createReadStream(decodedFile);
var reader = new wav.Reader();

// the "format" event gets emitted at the end of the WAVE header
reader.on('format', function (format) {
    // the WAVE header is stripped from the output of the reader
    reader.pipe(new Speaker(format));
});

// pipe the WAVE file to the Reader instance
file.pipe(reader);

console.log('Delete decoded file: ' + decodedFile);
fs.unlinkSync(decodedFile);
console.log('Bye!');
