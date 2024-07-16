const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
	origin: '*',
	methods: ['GET', 'POST'],
	allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Ensure uploads and results directories exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync('results')) {
  fs.mkdirSync('results');
}

// Routes
app.get('/', (req, res) => {
  res.send('Pose Estimation Backend is running');
});

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

app.post('/process-video', upload.single('video'), (req, res) => {
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log(`File received: ${req.file.originalname}`);

  const pythonProcess = spawn('python', ['process_video.py', req.file.path]);

  let pythonOutput = '';
  let pythonError = '';

  pythonProcess.stdout.on('data', (data) => {
    pythonOutput += data.toString();
    console.log(`Python stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    pythonError += data.toString();
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on('error', (error) => {
    console.error(`Error spawning Python process: ${error}`);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  });

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
  
	fs.readFile('results.json', 'utf8', (err, data) => {
	  if (err) {
		console.error('Error reading results:', err);
		return res.status(500).json({ error: 'Error reading processing results' });
	  }
  
	  try {
		const result = JSON.parse(data);
		res.json({
		  message: 'Video processed successfully',
		  result: result,
		  pythonOutput: pythonOutput
		});
	  } catch (parseError) {
		console.error('Error parsing results:', parseError);
		res.status(500).json({
		  error: 'Error parsing processing results',
		  details: parseError.toString()
		});
	  }
	});
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
