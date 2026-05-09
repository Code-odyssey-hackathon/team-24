# 🏥 Smart Healthcare Access System

### **"Your Health, Our Priority — Anytime, Anywhere."**

The **Smart Healthcare Access System** is a next-generation healthcare platform designed to bridge the gap between patients and medical facilities. It combines real-time mapping, AI-driven emergency response, and decentralized booking systems to ensure that healthcare is accessible to both urban and rural populations.

---

## 🚀 Problem Statement
In critical medical situations, every second counts. However, patients often face several hurdles:
- **Fragmented Information**: Difficulty finding hospitals with available beds or specific specialties near their current location.
- **Queue Congestion**: Long waiting times for tokens and appointments.
- **Emergency Delays**: Lack of a centralized, smart broadcast system to alert nearby hospitals during an emergency.
- **Rural Inaccessibility**: Limited access to digital healthcare in areas with poor internet connectivity.

---

## ✨ Key Functionality

### 1. 📍 Dynamic Hospital Mapping
- Integrated **Leaflet.js** map showing real-time hospital locations.
- Uses **OpenStreetMap (Overpass API)** to discover facilities within a 10km radius of the user.
- Visual markers for "You are here" and nearby medical centers.

### 2. 🚨 AI-Powered Smart Emergency Response
- **One-Tap Emergency**: Instantly broadcasts emergency alerts to all nearby hospitals.
- **Neural Threat Analysis**: Uses an AI-heuristic engine to filter out spam calls and prioritize genuine emergencies.
- **Real-time Dispatch**: Calculates the nearest hospital and simulates ambulance dispatch with live ETA tracking.

### 3. 🤖 AI Symptom Analysis & Triage
- Automated symptom analyzer suggests the correct department (Cardiology, Neurology, etc.) based on user input.
- **Smart Recommendations**: Suggests the best-performing hospital for a specific condition based on availability and specialty.

### 4. 🎫 Instant Token Booking
- Digital token generation to "skip the queue."
- Support for **SMS-based booking** for users in rural areas with limited internet.

### 5. 📊 Admin Dashboard
- Centralized hub for hospital management.
- Real-time monitoring of all bookings and emergency requests.
- **Security Center**: Manage spam reputations and blacklist malicious actors.

### 6. 🌐 Multi-Language Support
- Fully translated into **English, Hindi, Tamil, Telugu, and Bengali** to ensure inclusivity across India.

---

## 🛠️ How It Works (Technical Stack)

### **Frontend**
- **HTML5 & Vanilla CSS3**: High-performance, cyberpunk-inspired UI with glassmorphism effects.
- **JavaScript (ES6+)**: Core logic for mapping, routing, and state management.
- **Leaflet.js**: Powering the interactive mapping interface.

### **Backend**
- **Node.js & Express**: Handling API requests, authentication, and routing.
- **Mongoose**: Modeling healthcare data and managing MongoDB connections.

### **Security (AI Spam Filter)**
- **Behavioral Analysis**: Tracks user interaction patterns (click speed, automation detection).
- **Reputation System**: Persistent trust scores for phone numbers stored in MongoDB.

### **Database**
- **MongoDB Atlas**: A cloud-based database for persistent storage of hospital records, user bookings, and security logs.

---

## ☁️ Deployment
The project is optimized for cloud hosting and can be deployed with one click:
- **Live Link**: [https://smart-healthcare-access.onrender.com](https://smart-healthcare-access.onrender.com)
- **Host Provider**: Render (using the included `render.yaml` Blueprint).

---

## 🛠️ Local Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Configure your `.env` file with `MONGODB_URI`.
4. Start the server: `node server.js`.
5. Open `http://localhost:5000` in your browser.

---

**Developed for the Code Odyssey Hackathon 2026**
