const fs      = require('fs');
const path    = require('path');
const Pdf2Img = require('pdf2img-promises');

const input   =  './Report.pdf';
const fileName = 'Report';

const converter = new Pdf2Img();


converter.on(fileName, (msg) => {
  console.log('Received: ', msg);
});

converter.setOptions({
  type: 'png',                                // png or jpg, default jpg
  size: 1024,                                 // default 1024
  density: 600,                               // default 600
  quality: 100,                               // default 100
  outputdir: `${__dirname}${path.sep}output`, // output folder, default null (if null given, then it will create folder name same as file name)
  outputname: fileName,                       // output file name, dafault null (if null given, then it will create image name same as input name)
  page: 1                                  // convert selected page, default null (if null given, then it will convert all pages)
});

converter.convert(input)
  .then(info => {
    console.log(info);
  })
  .catch(err => {
    console.error(err);
  })