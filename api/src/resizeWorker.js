const gm = require('gm');
const { parentPath, workerData, parentPort} = require('worker_threads');

gm(workerData.source)
    .resize(100, 100)
    .write(workerData.destination, (error) => {
        if (error) throw error;
        parentPort.postMessage({resized: true});
    })