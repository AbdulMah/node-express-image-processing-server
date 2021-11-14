const { SourceMap } = require('module');
const { resolve } = require('path');
const path = require('path');
const { reject } = require('ramda');
const { Worker, isMainThread } = require('worker_threads');


const uploadToResizeWorker = path.resolve(__dirname, 'resizeWorker.js');
const pahtToMonoChromeWorker = path.resolve(__dirname, 'monochromeworker.js');

const uploadPathResolver = (filename) => {
    return path.resolve(__dirname, '../uploads', filename);
}

const imageProcessor = () => {
    const resizeWorkerFinished = false;
    const monochromeFinished = false;

    const sourcePath = uploadPathResolver(filename);
    const resizedDestination = uploadPathResolver('resized-' + filename);
    const monochromeDestination = uploadPathResolver('monochrome-' + filename);

    return new Promise((resolve, reject) => {
        if (isMainThread) {
            try {
                const resizeWorker = new Worker(pathToResizeWorker, {
                    workerData: {
                        source: sourcePath,
                        destination: monochromeDestination,
                    },
                });
                resizeWorker.on('message', (message) => {
                    resizeWorkerFinished = true;
                    if (monochromeFinished) {
                        resolve('resozeWorker finished processing');
                    }
                });
                resizeWorker.on('error', (error) => {
                    reject(new Error(error.message));
                });

                resizeWorker.on('exit', (code) => {
                    if (code !== 0) {
                        reject(new Error('Exited with status code ' + code));
                    }
                });

                monochromeWorker.on('message', (message) => {
                    monochromeFinished = true;
                    if (resizeWorkerFinished){
                        resolve('monochromeWorker finished processing');
                    }
                });
                
                monochromeWorker.on('exit', (code) => {
                    if (code !== 0) {
                        reject(new Error('Exited with status code ' + code));
                    }
                });
            } catch (error) {
                reject(error);
            }
        } else {
            reject(new Error('not on main thread'))
        }
    });
};