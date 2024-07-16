const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const videoPath = 'test_video.mp4';
const url = 'http://localhost:3000/process-video';

const form = new FormData();
form.append('video', fs.createReadStream(videoPath));

axios.post(url, form, {
  headers: {
    ...form.getHeaders(),
  },
}).then(response => {
  console.log('Response:', response.data);
}).catch(error => {
  console.error('Error:', error.message);
});
