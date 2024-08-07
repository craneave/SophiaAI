# Welcome to My Fitness App Backend 👋

## Overview
Welcome to the backend of my fitness app! This server-side component is built using **Node.js** and **Express.js**, designed to handle video uploads, process them with Python scripts, and return updated videos with key points, rep counts, and other insightful features. For now, the system prioritizes functionality over speed, but future improvements may include performance optimizations or native development for iOS and Android to eliminate video transfer bottlenecks. 🚀

## Tools and Technologies 🛠️
- **Node.js** and **Express.js**: For server-side operations and handling HTTP requests.
- **Python**: For video processing and key point extraction scripts.
- **Python Libraries**: Includes various libraries used in the Python scripts for video processing.

## Features ✨
- **Video Upload**: Users can upload exercise videos to be analyzed. 📹
- **Processing**: Python scripts analyze the videos, extract key points, and compute rep counts. 🔍
- **Response**: The backend sends the processed video back to users, complete with visual key points and additional metrics. 📈

## Current Status ⏳
- **Performance**: The current implementation is functional but not optimized for speed. Plans may involve improving performance or considering native development to avoid video transfers. ⚙️
- **Functionality**: The focus is on ensuring all features work as intended, with room for optimization in subsequent iterations. 🔧

## Project Structure 🗂️
- **`src/`**: Contains all the Python scripts, organized by their functionality.
- **`App.js`**: Manages all server-side actions and handles routing for video uploads and responses.

