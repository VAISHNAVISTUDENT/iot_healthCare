// Required modules
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const Patient = require('./models/patient_info_general');
const Doctor = require('./models/doctor_info');
const LivePatient = require('./models/patient_live_info');
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});
const MONGO_URL = 'database://url;';

// Configure app
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to DB');
}
main().catch((err) => console.error(err));

// Routes
app.get('/Dashboard', async (req, res) => {
  const allDoctor = await Doctor.find({});
  const allPatient = await Patient.find({});
  const livePatient = await LivePatient.find({});
  const numDoc = allDoctor.length;
  const numPat = allPatient.length;
  const numliveData = livePatient.length;
  // console.log(num);
  
  res.render('Dashboard.ejs', { allDoctor ,numDoc,numPat,numliveData});
});

app.get('/addPatient', (req, res) => {
  res.render('addPatient.ejs');
});

app.post('/addPatient', async (req, res) => {
  const newPatient = new Patient(req.body.Patient);
  await newPatient.save();
  res.redirect('/Dashboard');
});

app.get('/showPatients', async (req, res) => {
  const allPatient = await Patient.find({});
  res.render('showPatients.ejs', { allPatient });
});

app.get('/:id/showPatientDashBoard', async (req, res) => {
  const RoomNumber = req.params.id;

  try {
    const patientData = await Patient.findOne({ RoomNumber: RoomNumber });
    if (!patientData) return res.status(404).send('Patient not found');
    res.render('showPatientDashboard.ejs', { patient: patientData });
  } catch (err) {
    console.error('Error fetching patient data:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/addDoctor', (req, res) => {
  res.render('addDoctor.ejs');
});
app.get('/:id/doctor-info', async(req, res) => {
  const doctor = await Doctor.findOne({_id : req.params.id});
  res.render('doctorDashboard.ejs',{doctor});
});

app.post('/addDoctor', async (req, res) => {
  const newDoctor = new Doctor(req.body.Doctor);
  await newDoctor.save();
  res.redirect('/Dashboard');
});
// app.get('/:id/prescription',async(req,res) => {
//   const id = req.params.id;
//   res.render('prescription.ejs');
// });


// WebSocket Server Setup
const wss = new WebSocket.Server({ port: 8081 });
wss.on('connection', (ws) => {
  console.log('Arduino connected via raw WebSocket');

  ws.on('message', async (msg) => {
    console.log('Data from Arduino:', msg.toString());

    try {
      const data = JSON.parse(msg.toString());
      const selfId = data.selfId;
      // Emit data to clients subscribed to this patient's selfId
      io.emit(`${selfId}`, data);
      // Save live data to MongoDB
      const liveData = new LivePatient(data);
      await liveData.save();
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
});

io.on('connection', (socket) => {
  console.log('Frontend connected via Socket.IO');
  socket.on('disconnect', () => {
    console.log('Frontend disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});