#!/usr/bin/env node
/**
 * server.js — Local development server for FaceExpressionXtoys
 *
 * Features:
 *  • Serves the app at http://localhost:3000
 *  • Serves local face-api.js and models (offline, no CDN needed)
 *  • Serves MediaPipe Hands and camera_utils from node_modules
 *  • Provides a local webhook endpoint: GET /webhook?level=N&intensity=N&...
 *  • Broadcasts live state to any connected page via SSE: GET /events
 *  • Serves current state as JSON: GET /state
 */

const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Latest state from webhook calls ─────────────────────────
let latestState = {
    level: 0, intensity: 0, emotion: 'none',
    eyesOpen: 0, smile: 0, browsRelaxed: 0, gazeOk: 0, headStable: 0,
    updatedAt: null
};

// ── SSE clients ──────────────────────────────────────────────
const sseClients = new Set();

function broadcastSSE(data) {
    const msg = 'data: ' + JSON.stringify(data) + '\n\n';
    for (const res of sseClients) {
        try { res.write(msg); } catch (_) { sseClients.delete(res); }
    }
}

// ── CORS for browser fetch from file:// or any origin ───────
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    next();
});

// ── Static: app root ─────────────────────────────────────────
app.use(express.static(path.join(__dirname)));

// ── Static: face-api.js from node_modules (fallback) ────────
app.use('/vendor', express.static(
    path.join(__dirname, 'node_modules/@vladmandic/face-api/dist')
));

// ── Static: face-api models from node_modules (fallback) ────
app.use('/model', express.static(
    path.join(__dirname, 'node_modules/@vladmandic/face-api/model')
));

// ── Static: MediaPipe Hands ──────────────────────────────────
app.use('/mediapipe/hands', express.static(
    path.join(__dirname, 'node_modules/@mediapipe/hands')
));

// ── Static: MediaPipe camera_utils ──────────────────────────
app.use('/mediapipe/camera', express.static(
    path.join(__dirname, 'node_modules/@mediapipe/camera_utils')
));

// ── Local webhook endpoint ───────────────────────────────────
// Receives: GET /webhook?level=N&intensity=N&emotion=X&eyesOpen=N&...
app.get('/webhook', (req, res) => {
    const q = req.query;
    latestState = {
        level:       parseInt(q.level)       || 0,
        intensity:   parseInt(q.intensity)   || 0,
        emotion:     q.emotion               || 'none',
        eyesOpen:    parseInt(q.eyesOpen)    || 0,
        smile:       parseInt(q.smile)       || 0,
        browsRelaxed:parseInt(q.browsRelaxed)|| 0,
        gazeOk:      parseInt(q.gazeOk)      || 0,
        headStable:  parseInt(q.headStable)  || 0,
        updatedAt:   Date.now()
    };
    broadcastSSE(latestState);
    res.json({ ok: true, state: latestState });
});

// ── Current state snapshot ───────────────────────────────────
app.get('/state', (req, res) => res.json(latestState));

// ── SSE stream ───────────────────────────────────────────────
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    // Send current state immediately on connect
    res.write('data: ' + JSON.stringify(latestState) + '\n\n');
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║  FaceExpressionXtoys — Local Server      ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log('║  App:      http://localhost:' + PORT + '          ║');
    console.log('║  Webhook:  http://localhost:' + PORT + '/webhook  ║');
    console.log('║  State:    http://localhost:' + PORT + '/state    ║');
    console.log('║  Events:   http://localhost:' + PORT + '/events   ║');
    console.log('╚══════════════════════════════════════════╝\n');
    console.log('Set CDN to "Local Files" and Webhook to "Local Server" in the app.');
    console.log('Press Ctrl+C to stop.\n');
});
