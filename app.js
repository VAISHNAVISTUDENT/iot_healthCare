const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const app = express();
const server = createServer(app);
const io = new Server(server);
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const MONGO_URL = "mongodb://127.0.0.1:27017/Hospital_Management_System";
const mongoose = require("mongoose");
const Patient = require('./models/patient_info_general');
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
app.get('/Dashboard',(req,res)=>{
  res.render('Dashboard.ejs');
});
app.get('/addPatient',(req,res)=>{
  res.render('addPatient.ejs');
});
app.post('/addPatient',async(req,res)=>{
  // code to put patient into database
  const newPatient = new Patient(req.body.Patient);
  await newPatient.save();
  res.redirect('/Dashboard');
});
app.get('/showPatients',async(req,res)=>{
  const allPatient = await Patient.find({});
  res.render('showPatients.ejs',{allPatient});
});
app.get('/showPatientDashBoard',(req,res)=>{
  res.render("showPatientDashboard.ejs");
})

io.on('connection', (socket) => {
    socket.on('patient_data_from_NODE', (msg) => {
      io.emit('patient_info_live', msg);
      // insert the data into database;
    });

});
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});