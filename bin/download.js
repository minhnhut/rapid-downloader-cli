#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2), {
    boolean: true
});

if (argv.help) {
console.log(`
Usage: rapid [OPTION]... [URL to download]

Mandatory arguments to long options are mandatory for short options too.
   --single                             force single connection download
   -c [NUMBER], --connection=[NUMBER]       maxium parallel connections should be used
`);
    return;
}

if (!argv._[0]) {
    console.log("URL to download was not provided. Check 'rapid --help' for more information.")
    return;
}

const {DownloadWorker, utils} = require("rapid-downloader");
const ProgressBar = require('progress');

const url = argv._[0];
const filename = url.substring(url.lastIndexOf('/')+1)

console.log("Download " + filename)

/**
 * Build options for Download Worker
 */

const options = {
    maxConnections: 8
};

// Max connections
if (argv.c) {
    options.maxConnections = argv.c
}
if (argv.connections) {
    options.maxConnections = argv.connections
}

// Force single connection
if (argv.s || argv.single) {
    options.forceSingleConnection = true
}

const bar = new ProgressBar('Progress | :bar | :percent | :download / :size | Speed: :speed', {
    width: 40,
    total: 100,
    size: 0,
    downloaded: 0
})

// Multi connections
const worker = new DownloadWorker(url, filename, options);
worker.on('error', e => {
    console.log(e);
})
worker.on('ready', (params) => {
    worker.on('progress', (progress) => {
        const speed = utils.dynamicSpeedUnitDisplay(progress.bytesPerSecond, 2);
        bar.update(progress.completedPercent/100, {
            size: progress.totalBytes,
            download: progress.downloadedBytes,
            speed
        });
    });
    worker.on('finishing', () => {
        console.log('Download is finishing')
    });
    worker.on('end', () => console.log('Download is done'));
    worker.start();
});