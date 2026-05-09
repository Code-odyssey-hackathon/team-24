require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const hospitalRoutes = require('./backend/routes/hospitalRoutes');
const bookingRoutes = require('./backend/routes/bookingRoutes');
const taskRoutes = require('./backend/routes/taskRoutes');
const emergencyRoutes = require('./backend/routes/emergencyRoutes');
const spamRoutes = require('./backend/routes/spamRoutes');

const Hospital = require('./backend/models/Hospital');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas Successfully');
    seedHospitals();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
  });

// Seed Data
async function seedHospitals() {
  try {
    const count = await Hospital.countDocuments();
    if (count === 0) {
      const initialHospitals = [
        { name:"City General Hospital", type:"government", distance:2.3, lat:28.6448, lng:77.2167, beds:120, bedsAvail:34, emergency:true, phone:"011-2345678", specialty:"general", doctors:[{name:"Dr. Priya Sharma",spec:"General Medicine"},{name:"Dr. Raj Patel",spec:"Cardiology"}] },
        { name:"Apollo Care Center", type:"private", distance:4.1, lat:28.6280, lng:77.2090, beds:200, bedsAvail:67, emergency:true, phone:"011-8765432", specialty:"cardiology", doctors:[{name:"Dr. Suresh Kumar",spec:"Cardiology"},{name:"Dr. Meena Iyer",spec:"Neurology"}] },
        { name:"District Community Hospital", type:"government", distance:6.7, lat:28.6560, lng:77.2410, beds:80, bedsAvail:12, emergency:true, phone:"011-5556789", specialty:"general", doctors:[{name:"Dr. Vikram Singh",spec:"Orthopedics"}] },
        { name:"Sunrise Private Hospital", type:"private", distance:3.5, lat:28.6350, lng:77.2250, beds:150, bedsAvail:45, emergency:false, phone:"011-9998877", specialty:"orthopedics", doctors:[{name:"Dr. Neha Gupta",spec:"Orthopedics"}] },
        { name:"Rural Health Center", type:"government", distance:12.0, lat:28.5830, lng:77.1760, beds:30, bedsAvail:8, emergency:true, phone:"011-1112233", specialty:"general", doctors:[{name:"Dr. Sita Ram",spec:"General Medicine"}] },
        { name:"Max Super Specialty", type:"private", distance:8.2, lat:28.6692, lng:77.2300, beds:350, bedsAvail:102, emergency:true, phone:"011-7776655", specialty:"neurology", doctors:[{name:"Dr. Amit Khanna",spec:"Neurology"}] }
      ];
      await Hospital.insertMany(initialHospitals);
      console.log('🌱 Seeded initial hospital data');
    }
  } catch (err) {
    console.error('Error seeding hospitals:', err);
  }
}

const authMiddleware = require('./backend/middleware/auth');

// API Routes
app.use('/api/hospitals', authMiddleware, hospitalRoutes);
app.use('/api/bookings', authMiddleware, bookingRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/emergency', authMiddleware, emergencyRoutes);
app.use('/api/spam', authMiddleware, spamRoutes);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

