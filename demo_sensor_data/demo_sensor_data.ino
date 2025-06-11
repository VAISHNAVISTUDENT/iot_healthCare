#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <DHT.h>
// DHT11 setup
#define DHTPIN D1 // Pin connected to DHT11 data
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
// Sensor pins
const int mq135Pin = A0;
const int pulsePin = D2;
// Replace with your WiFi credentials
const char* ssid = "DESKTOP-TE5O9SR 7033";
const char* password = "9860332078";
const char* selfId = "89";  // Unique ID for this device

// Replace with your server's IP address
const char* websocket_server_ip = "172.16.128.20";  // <-- Your Node.js server IP

WebSocketsClient webSocket;

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      Serial.println("WebSocket connected!");
      break;
    case WStype_DISCONNECTED:
      Serial.println("WebSocket disconnected");
      break;
    case WStype_TEXT:
      Serial.printf("Message from server: %s\n", payload);
      break;
    default:
      break;
  }
}

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Connected! IP Address: ");
  Serial.println(WiFi.localIP());

  // Connect to the WebSocket server
  webSocket.begin(websocket_server_ip, 8081, "/");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000); // Retry every 5 seconds if connection drops
    // Initialize sensors
  dht.begin();
  pinMode(pulsePin, INPUT);
}

int readPulse() {
  int count = 0;
  unsigned long start = millis();
  while (millis() - start < 1000) {
    if (digitalRead(pulsePin) == HIGH) {
      count++;
      delay(20);
    }
  }
  return count * 6;
}

int readMQ135() {
  return analogRead(mq135Pin);
}



void loop() {
  webSocket.loop();

  // Send patient data every 5 seconds
  static unsigned long lastSent = 0;
  if (millis() - lastSent > 5000) {
    lastSent = millis();

    float temp = dht.readTemperature();
    if (isnan(temp)) {
      Serial.println("Failed to read from DHT11 sensor!");
      temp = 30;
    }

    int mq135Val = readMQ135();
    int pulse = readPulse();

    int co2 = map(mq135Val, 0, 1023, 400, 2000);
    int smoke = map(mq135Val, 0, 1023, 10, 100);
    int voc = map(mq135Val, 0, 1023, 5, 50);
    // int o2 = 97; // still placeholder
    // Simulated sensor values (replace with actual sensor readings)
    // int pulse = random(70, 90);
    // float temp = random(360, 380) / 10.0;
    int o2 = random(94, 98);
    // int co2 = random(400, 500);
    // int smoke = random(20, 40);
    // int voc = random(10, 30);

    // Construct JSON message with selfId
    String message = "{\"selfId\": \"" + String(selfId) + "\"" +
                     ", \"pulse\": " + String(pulse) +
                     ", \"temp\": " + String(temp) +
                     ", \"o2\": " + String(o2) +
                     ", \"co2\": " + String(co2) +
                     ", \"smoke\": " + String(smoke) +
                     ", \"voc\": " + String(voc) + "}";

    webSocket.sendTXT(message);
    Serial.println("Sent: " + message);
  }
}
