const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const ROOT_DIR = path.dirname(__dirname);
const BUILD_DIR = path.join(ROOT_DIR, "build")
const ZIP_FILE_NAME = "code.zip";




const output = fs.createWriteStream(path.join(BUILD_DIR, ZIP_FILE_NAME));
const archive = archiver("zip", {zlib: { level: 9 }});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on('end', function() {
  console.log('Data has been drained');
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

// good practice to catch this error explicitly
archive.on('error', function(err) {
  throw err;
});

// pipe archive data to the file
archive.pipe(output);

archive.file('index.js');
archive.file('lib.js');
archive.file('package.json');
archive.directory('chinese-holidays-data/data/');

archive.finalize();