const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const app = express();
const server = createServer(app);
const io = new Server(server , {
  cors: {
    origin: "*"
  }
});
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const MONGO_URL = "mongodb://127.0.0.1:27017/Hospital_Management_System";
const mongoose = require("mongoose");
const Patient = require('./models/patient_info_general');
const Doctor = require('./models/doctor_info');
const WebSocket = require('ws');
app.engine("ejs" , ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

main()
.then(() => {
    console.log("connected to DB");
  })
.catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
// app.get('/chat1', (req, res) => {
//   res.render('home_page.ejs');
// });
// app.get('/chat2', (req, res) => {
//     res.sendFile(join(__dirname, 'index2.html'));
// });

// General Routes
app.get('/Dashboard',async(req,res)=>{
  const allDoctor = await Doctor.find({});
  res.render('Dashboard.ejs',{allDoctor});
});

// CRUD operation for patients

app.get('/addPatient',(req,res)=>{
  res.render('addPatient.ejs');
});

app.post('/addPatient',async(req,res)=>{
  const newPatient = new Patient(req.body.Patient);
  await newPatient.save();
  res.redirect('/Dashboard');
});
app.get('/showPatients',async(req,res)=>{
  const allPatient = await Patient.find({});
  console.log(allPatient);
  res.render('showPatients.ejs',{allPatient});
});

app.get('/showPatientDashBoard',(req,res)=>{
  res.render("showPatientDashboard.ejs");
});
// CRUD operation for doctors
app.get('/addDoctor',(req,res)=>{
  res.render("addDoctor.ejs");
});
// app.put('addPatient',(req,res)=>{

// })

app.post('/addDoctor',async(req,res) => {
  const newDoctor = new Doctor(req.body.Doctor);
  await newDoctor.save();
  res.redirect('/Dashboard');
});

// WebSocket server for Arduino (raw WebSocket)
const wss = new WebSocket.Server({ port: 8081  });  // Arduino sends data here

// When Arduino connects
wss.on('connection', (ws) => {
  console.log('Arduino connected via raw WebSocket');

  ws.on('message', (msg) => {
    // console.log('Data from Arduino:', msg.toString());

    // Forward this to all socket.io clients
    io.emit('patient_info_live', msg.toString());

    // Optional: insert into DB here
  });

  ws.on('close', () => {
    console.log('Arduino disconnected');
  });
});

io.on('connection', (socket) => {
  console.log("connection was establised");
    socket.on('patient_data_from_NODE', (msg) => {
      io.emit('patient_info_live', msg);
      // insert the data into database;
    });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});