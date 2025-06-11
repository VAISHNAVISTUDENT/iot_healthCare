


# 🏥 IoT-Based Real-Time Patient Monitoring System

A collaborative IoT project designed to monitor patient vitals in real time using **NodeMCU (ESP8266)** and **Socket.IO**, implementing the concept of **Digital Twins** for individual patients in a local LAN environment.

## 🚀 Project Overview

This system connects embedded sensors to a web-based dashboard, creating a **Digital Twin** for each patient. Each bed is equipped with a **NodeMCU** assigned a unique `selfId`, which is mapped to a specific patient ID. The system captures and transmits live environmental data such as **temperature** and **humidity** to a local Node.js server, which updates the patient's virtual representation instantly.

## ⚙️ Key Features

* 📡 Real-time data transfer using **Socket.IO**
* 🌐 Local network communication (LAN) between NodeMCU and server
* 🔒 Unique **selfId** assigned to each NodeMCU and linked to a patient
* 💻 **Ejs dashboard** for live monitoring of patient vitals
* 🚨 Visual and audio alerts (LEDs, buzzer, LCD) triggered when thresholds are exceeded
* 🧠 Implements the concept of a **Digital Twin** for personalized monitoring

## 🧰 Tech Stack

* **Hardware**: NodeMCU (ESP8266), DHT11 / LM35 sensors, LED, buzzer, LCD
* **Frontend**: Ejs
* **Backend**: Node.js, Express.js, Socket.IO
* **Database**: MongoDB / MySQL
* **Communication**: WebSocket (via Socket.IO), LAN (Wi-Fi)

## 🖼️ System Architecture

1. Sensors on NodeMCU read data →
2. Data sent via Wi-Fi to Node.js server on local LAN →
3. Server pushes data to frontend via Socket.IO →
4. Dashboard updates in real time →
5. Alerts are triggered if critical conditions are met


