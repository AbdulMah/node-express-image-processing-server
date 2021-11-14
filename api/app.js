const { response } = require('express');
const express = require('express');
const { request } = require('http');

const path = require('path');
const router = require('./src/router');
const app = express();
const pathToIndex = path.resolve(__dirname, '../client/index.html');
//const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');


app.use('/', router);
app.use(express.static(path.resolve(__dirname, 'uploads')));
app.use('/*', (request, response) => {
    response.sendFile(pathToIndex);
});
module.exports = app;