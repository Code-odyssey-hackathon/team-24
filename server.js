require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './')));

// MongoDB Connection
// NOTE: Make sure to replace <db_password> in your .env file with your actual password!
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas Successfully');
    seedHospitals();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    console.log('💡 Tip: Did you replace <db_password> in the .env file?');
  });

// Schemas
const hospitalSchema = new mongoose.Schema({
  name: String,
  type: String,
  distance: Number,
  lat: Number,
  lng: Number,
  beds: Number,
  bedsAvail: Number,
  emergency: Boolean,
  phone: String,
  specialty: String,
  doctors: [{ name: String, spec: String }]
});

const bookingSchema = new mongoose.Schema({
  patientName: String,
  patientPhone: String,
  patientDept: String,
  hospitalName: String,
  tokenNum: String,
  reportTime: String,
  date: { type: String, default: () => new Date().toLocaleDateString() }
});

const Hospital = mongoose.model('Hospital', hospitalSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// Initial Seed Data (if collection is empty)
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
      console.log('🌱 Seeded initial hospital data to MongoDB');
    }
  } catch (err) {
    console.error('Error seeding hospitals:', err);
  }
}

// API Routes
app.get('/api/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/hospitals', async (req, res) => {
  try {
    const newHospital = new Hospital(req.body);
    await newHospital.save();
    res.status(201).json(newHospital);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const tokenNum = 'TKN-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const reportTime = new Date(now.getTime() + 60 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const booking = new Booking({
      patientName: req.body.patientName,
      patientPhone: req.body.patientPhone,
      patientDept: req.body.patientDept,
      hospitalName: req.body.hospitalName,
      tokenNum,
      reportTime
    });
    
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/emergency', async (req, res) => {
  try {
    const { patientLat, patientLng } = req.body;
    
    // 1. Get all hospitals
    const hospitals = await Hospital.find();
    
    if (hospitals.length === 0) {
      return res.status(404).json({ error: 'No hospitals found' });
    }

    // 2. Create emergency bookings for ALL hospitals
    const emergencyRequests = hospitals.map(h => ({
      patientName: 'EMERGENCY PATIENT',
      patientPhone: req.body.patientPhone || '911',
      patientDept: 'EMERGENCY',
      hospitalName: h.name,
      tokenNum: 'EMRG-' + Math.floor(1000 + Math.random() * 9000),
      reportTime: 'IMMEDIATE'
    }));

    await Booking.insertMany(emergencyRequests);

    // 3. Find the nearest hospital
    let nearest = hospitals[0];
    let minSource = Infinity;

    if (patientLat && patientLng) {
      hospitals.forEach(h => {
        // Simple distance calculation
        const dist = Math.sqrt(Math.pow(h.lat - patientLat, 2) + Math.pow(h.lng - patientLng, 2));
        if (dist < minSource) {
          minSource = dist;
          nearest = h;
        }
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Emergency broadcast sent to all hospitals',
      assignedHospital: nearest.name,
      allHospitals: hospitals.map(h => h.name),
      eta: Math.floor(Math.random() * 10) + 5 // Simulated ETA 5-15 mins
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
