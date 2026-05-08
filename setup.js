#!/usr/bin/env node
/**
 * setup.js — copies face-api.js and model files from node_modules into
 * the repo's vendor/ and model/ directories so the app works fully offline
 * without needing the local server.
 *
 * Run once after `npm install`:   node setup.js
 */
const fs   = require('fs');
const path = require('path');

const ROOT    = __dirname;
const SRC_LIB = path.join(ROOT, 'node_modules/@vladmandic/face-api/dist/face-api.js');
const SRC_MOD = path.join(ROOT, 'node_modules/@vladmandic/face-api/model');
const DST_LIB = path.join(ROOT, 'vendor');
const DST_MOD = path.join(ROOT, 'model');

function copyDir(src, dst) {
    fs.mkdirSync(dst, { recursive: true });
    for (const f of fs.readdirSync(src)) {
        fs.copyFileSync(path.join(src, f), path.join(dst, f));
        process.stdout.write('  copied: ' + f + '\n');
    }
}

console.log('=== FaceExpressionXtoys offline setup ===\n');

// face-api.js library
fs.mkdirSync(DST_LIB, { recursive: true });
fs.copyFileSync(SRC_LIB, path.join(DST_LIB, 'face-api.js'));
console.log('✓ vendor/face-api.js');

// model files
copyDir(SRC_MOD, DST_MOD);
console.log('✓ model/ (' + fs.readdirSync(DST_MOD).length + ' files)');

console.log('\nDone. Open index.html in the browser with CDN set to "Local Files",');
console.log('or run `npm start` to use the full local server (offline + local webhook).');
