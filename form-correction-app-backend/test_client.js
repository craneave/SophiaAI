/**
 * @file test_client.js
 * 
 * @description This is a tester client to test the backend capabilities of the app.js server
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

/* Constants */
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const videoPath = 'test_videos/test_video.mp4';
const url = 'http://localhost:3000/process-video';
const form = new FormData();

//create form
form.append('video', fs.createReadStream(videoPath));

// using axios, post and log the response or error
axios.post(url, form, {
  headers: {
    ...form.getHeaders(),
  },
}).then(response => {
  console.log('Response:', response.data);
}).catch(error => {
  console.error('Error:', error.message);
});
