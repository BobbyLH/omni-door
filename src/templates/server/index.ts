export default function () {
  return `'use strict';

const path = require('path');
const express = require('express');
const { exec } = require('child_process');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const config = require('./webpack.config.dev.js');

const compiler = webpack(config);
const app = express();

app.use(middleware(compiler, {
  publicPath: '/',
  logLevel: 'debug'
}));

app.use('*', function (req, res, next) {
  const filename = path.join(compiler.outputPath, 'index.html');
  compiler.outputFileSystem.readFile(filename, function (err, result) {
    if (err) {
      return next(err);
    }
    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
  })
});

const port = 6200;
app.listen(port, () => {
  const url = 'http://localhost:' + port;
  switch(process.platform) {
    case 'darwin':
      exec('open ' + url);
      break;
    case 'win32':
      exec('start ' + url);
      break;
  };
  console.info('> Ready on ' + url);
});
`;
}