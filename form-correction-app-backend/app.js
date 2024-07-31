/**
 * @file server.js
 * 
 * @description This server handles video file uploads, processes them using a Python script for pose estimation, 
 *              and serves the processed video results. Utilizes Express for server management, Multer for file handling,
 *              and child_process for executing Python scripts.
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

/* Constants */
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

/* Middleware to handle CORS settings, parse JSON, and log request details */
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

/* Serve static files from the 'results' directory */
app.use('/processed-videos', express.static('results'));

/* Multer setup for file uploads */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

/* Ensure 'uploads' and 'results' directories exist */
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

ensureDirectoryExists('uploads');
ensureDirectoryExists('results');

/*_______________Routes________________ */

// Test route to verify server functionality
app.get('/', (req, res) => {
    res.send('Pose Estimation Backend is running');
});

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

/* Route to handle video processing */
app.post('/process-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`File received: ${req.file.originalname}`);

    // spawn python process 
    const pythonProcess = spawn('python', ['src/main.py', req.file.path]);
    let pythonOutput = '';
    let pythonError = '';

    // check for stdout
    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
        console.log(`Python stdout: ${data}`);
    });

    // check for stderr
    pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
        console.error(`Python stderr: ${data}`);
    });

    // check for process error
    pythonProcess.on('error', (error) => {
        console.error(`Error spawning Python process: ${error}`);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    });

    // check for close error
    pythonProcess.on('close', (code) => {
        console.log(`Python process closed with code ${code}`);
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            console.error(`Python Error: ${pythonError}`);
            return res.status(500).json({
                error: 'Error processing video',
                pythonError: pythonError,
                exitCode: code
            });
        }

        // parse JSON
        fs.readFile('results.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading results:', err);
                return res.status(500).json({ error: 'Error reading processing results' });
            }
            try {
                const result = JSON.parse(data);
                console.log("RESULTS", result);
                const processedVideoFilename = path.basename(result.processedVideoPath);
                const processedVideoUrl = `${req.protocol}://${req.get('host')}/processed-videos/${processedVideoFilename}`;
                res.json({
                    message: 'Video processed successfully',
                    result: {
                        ...result,
                        processedVideoUrl: processedVideoUrl
                    },
                    pythonOutput: pythonOutput
                });
            } catch (parseError) {
                console.error('Error parsing:', parseError);
                res.status(500).json({ error: 'Error parsing processing results' });
            }
        });
    });
});

/* Start the server */
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
