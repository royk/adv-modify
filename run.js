const fs = require('fs');
const { parseString } = require('xml2js');
const zlib = require('zlib');

function modifications(text) {
    return text.replace('<Manual Value="5" />', '<Manual Value="0" />');
  }

function decodeBinaryXML(filePath) {
    // Read the file as a binary buffer
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return console.error('Error reading file:', err);
        }
        // uncompress the data
        zlib.gunzip(data, (err, decompressed) => {
          if (err) {
              console.error('Decompression failed. This might not be a gzip file:', err);
              return;
          }

          // Convert the binary buffer to a string
          let text = decompressed.toString('utf8');
          // modify the text
          text = modifications(text);
          // Convert the modified text back to a buffer
          const modifiedBuffer = Buffer.from(text, 'utf8');
          // Compress the buffer
          zlib.gzip(modifiedBuffer, (err, compressed) => {
            if (err) {
                console.error('Error during compression:', err);
                return;
            }

            // Write the compressed data back to a file
            const outputFilePath = 'output.adv';
            fs.writeFile(outputFilePath, compressed, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                } else {
                    console.log('File re-compressed and saved successfully:', outputFilePath);
                }
            });
        });
      });
       
    });
}

decodeBinaryXML('test.adv')


