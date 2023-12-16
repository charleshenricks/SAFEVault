#include <Arduino.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"
#include <WiFi.h>
#include <ESP32Servo.h>
#include <Keypad.h>
#include <HardwareSerial.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define LED1 13
#define LED2 12
#define vaultServo1 18
// #define TRIG_PIN 5
// #define ECHO_PIN 16
// #define YellowLED_PIN 35
unsigned long startTime = 0;

const int ROWS = 4;
const int COLS = 4;

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

char hexaKeys[ROWS][COLS] = {
    {'1', '2', '3', 'A'},
    {'4', '5', '6', 'B'},
    {'7', '8', '9', 'C'},
    {'*', '0', '#', 'D'}};

byte rowPins[ROWS] = {19, 25, 26, 14};
byte colPins[COLS] = {27, 32, 16, 4};

Keypad customKeypad = Keypad(makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS);

Servo SafeVaultServo;

// Variable to store the start time
const unsigned long duration = 2000; // Duration in milliseconds (30 seconds)

// SSID and Password
// const char *ssid = "ZTE_2.4G_XshuY9";
// const char *password = "PukNTRu3";
// const char *ssid = "RoomSaCute2.4G";
// const char *password = "123#Colawin#123";
const char *ssid = "realme GT NEO 3";
const char *password = "05132001";

/**** NEED TO CHANGE THIS ACCORDING TO YOUR SETUP *****/
// The REST API endpoint - Change the IP Address
const char *base_rest_url = "http://192.168.62.28:5000/";
// const char *base_rest_url = "http://192.168.1.20:5000/";
// const char *base_rest_url = "http://192.168.35.69:5000/";

WiFiClient client;
HTTPClient http;

char sensorObjectId[30];

struct LED
{
  char sensor_id[10];
  char description[20];
  char location[20];
  bool enabled;
  char type[20];
  char status[10];
};

struct IItem
{
  char item_type[10];
  char description[10];
  char item_claim[10];
  // bool status;
  int pin;
  char loc[20];
};

const int JSON_DOC_SIZE = 500;
const int JSON_DOC_SIZE2 = 2000;

// HTTP GET Call for sensors
StaticJsonDocument<JSON_DOC_SIZE> callHTTPGet(const char *sensor_id)
{
  char rest_api_url[200];
  sprintf(rest_api_url, "%sapi/sensors/%s", base_rest_url, sensor_id);
  Serial.println(rest_api_url);

  http.useHTTP10(true);
  http.begin(client, rest_api_url);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.GET();

  StaticJsonDocument<JSON_DOC_SIZE> doc;

  if (httpCode > 0)
  {
    Serial.printf("HTTP Response code: %d\n", httpCode);
    if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY)
    {
      DeserializationError error = deserializeJson(doc, http.getStream());
      if (error)
      {
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.c_str());
        http.end();
        return doc; // Or handle error as needed
      }
    }
  }
  else
  {
    Serial.printf("Error on HTTP request: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
  return doc;
}

// HTTP GET Call for IItems
StaticJsonDocument<JSON_DOC_SIZE2> callHTTPGetJson(const char *item_claim)
{
  char rest_api_url[200];
  sprintf(rest_api_url, "%sapi/items/%s", base_rest_url, item_claim);
  Serial.println(rest_api_url);

  http.useHTTP10(true);
  http.begin(client, rest_api_url);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.GET();

  StaticJsonDocument<JSON_DOC_SIZE2> doc;

  if (httpCode > 0)
  {
    Serial.printf("HTTP Response code: %d\n", httpCode);
    if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY)
    {
      DeserializationError error = deserializeJson(doc, http.getStream());
      if (error)
      {
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.c_str());
        http.end();
        return doc; // Or handle error as needed
      }
    }
  }
  else
  {
    Serial.printf("Error on HTTP request: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
  return doc;
}
// end of HTTP GET Call for IItems

// Extract IItem records
IItem extractIItemConfiguration(const char *item_claim)
{
  StaticJsonDocument<JSON_DOC_SIZE2> doc = callHTTPGetJson(item_claim);
  if (doc.isNull())
  {
    Serial.println("JSON document is null");
    return {}; // or LED{}
  }
  if (!doc.is<JsonArray>())
  {
    Serial.println("JSON document is not an array");
    return {}; // or LED{}
  }
  for (JsonObject item : doc.as<JsonArray>())
  {
    IItem theItem = {};

    if (item.containsKey("item_type"))
    {
      strncpy(theItem.item_type, item["item_type"] | "", sizeof(theItem.item_type));
    }
    if (item.containsKey("item_claim"))
    {
      strncpy(theItem.item_claim, item["item_claim"] | "", sizeof(theItem.item_claim));
    }
    // theItem.status = item["status"];
    theItem.pin = item["pin"];
    if (item.containsKey("loc"))
    {
      strncpy(theItem.loc, item["loc"] | "", sizeof(theItem.loc));
    }
    // if(item)
    // {
    //   Serial.println(item);
    //   const char *objectId = item["_id"]["$oid"]; // "dht22_1"
    //   strcpy(sensorObjectId, objectId);
    //   //return;
    // }

    return theItem;
  }
  Serial.println("No items found in JSON array");
  return {}; // or LED{}
}

// Extract LED records
LED extractLEDConfiguration(const char *sensor_id)
{
  StaticJsonDocument<JSON_DOC_SIZE> doc = callHTTPGet(sensor_id);
  if (doc.isNull())
  {
    Serial.println("JSON document is null");
    return {}; // or LED{}
  }

  if (!doc.is<JsonArray>())
  {
    Serial.println("JSON document is not an array");
    return {}; // or LED{}
  }

  for (JsonObject item : doc.as<JsonArray>())
  {
    LED ledTemp = {};

    if (item.containsKey("sensor_id"))
    {
      strncpy(ledTemp.sensor_id, item["sensor_id"] | "", sizeof(ledTemp.sensor_id));
    }

    if (item.containsKey("description"))
    {
      strncpy(ledTemp.description, item["description"] | "", sizeof(ledTemp.description));
    }

    if (item.containsKey("location"))
    {
      strncpy(ledTemp.location, item["location"] | "", sizeof(ledTemp.location));
    }

    ledTemp.enabled = item["enabled"] | false;

    if (item.containsKey("type"))
    {
      strncpy(ledTemp.type, item["type"] | "", sizeof(ledTemp.type));
    }

    if (item.containsKey("value"))
    {
      strncpy(ledTemp.status, item["value"] | "", sizeof(ledTemp.status));
    }

    return ledTemp;
  }

  Serial.println("No items found in JSON array");
  return {}; // or LED{}
}

// Convert HIGH and LOW to Arduino compatible values
int convertStatus(const char *value)
{
  if (strcmp(value, "HIGH") == 0)
  {
    SafeVaultServo.write(90);
    Serial.println("Setting LED to HIGH");
    return HIGH;
  }
  else
  {
    SafeVaultServo.write(0);
    Serial.println("Setting LED to LOW!");
    return LOW;
  }
}

// Set our LED status
void setLEDStatus(int status)
{
  Serial.printf("Setting LED status to : %d", status);
  Serial.println("");
  digitalWrite(LED1, status);
}

// Send sensor values using HTTP PUT
void sendSensorStatus(const char *sensor_id)
{
  char rest_api_url[200];
  // Construct the REST API URL
  sprintf(rest_api_url, "%sapi/sensors/%s", base_rest_url, sensor_id);
  Serial.println(rest_api_url);

  // Create and populate the JSON document
  StaticJsonDocument<JSON_DOC_SIZE> doc;
  doc["value"] = "HIGH"; // Directly set value to "HIGH"// Replace with actual fields

  // Serialize JSON to a string
  String jsondata;
  serializeJson(doc, jsondata);

  // Send the HTTP PUT request
  HTTPClient http;
  http.begin(rest_api_url);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.PUT(jsondata);

  if (httpResponseCode > 0)
  {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
  }
  else
  {
    Serial.print("Error on sending PUT: ");
    Serial.println(httpResponseCode);
  }

  http.end(); // Free resources
}

void sendOFFSensorStatus(const char *sensor_id)
{
  char rest_api_url[200];
  // Construct the REST API URL
  sprintf(rest_api_url, "%sapi/sensors/%s", base_rest_url, sensor_id);
  Serial.println(rest_api_url);

  // Create and populate the JSON document
  StaticJsonDocument<JSON_DOC_SIZE> doc;
  doc["value"] = "LOW"; // Directly set value to "HIGH"// Replace with actual fields

  // Serialize JSON to a string
  String jsondata;
  serializeJson(doc, jsondata);

  // Send the HTTP PUT request
  HTTPClient http;
  http.begin(rest_api_url);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.PUT(jsondata);

  if (httpResponseCode > 0)
  {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
  }
  else
  {
    Serial.print("Error on sending PUT: ");
    Serial.println(httpResponseCode);
  }

  http.end(); // Free resources
}

// Send Item values using HTTP PUT
void sendItemClaimType(const char *item_claim)
{
  char rest_api_url[200];
  // Construct the REST API URL
  sprintf(rest_api_url, "%sapi/items/%s", base_rest_url, item_claim);
  Serial.println(rest_api_url);

  // Create and populate the JSON document
  StaticJsonDocument<JSON_DOC_SIZE> doc;
  doc["item_claim"] = "claimed"; // Directly set item_claim to "claimed"// Set item_claim to "claimed"

  // Serialize JSON to a string
  String jsondata;
  serializeJson(doc, jsondata);

  // Send the HTTP PUT request
  HTTPClient http;
  http.begin(rest_api_url);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.PUT(jsondata);

  if (httpResponseCode > 0)
  {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
  }
  else
  {
    Serial.print("Error on sending PUT: ");
    Serial.println(httpResponseCode);
  }

  http.end(); // Free resources
}

// if the user is admin
void OverDriveVault()
{
  sendSensorStatus("led_1");
  unsigned long previousMillis = 0;
  const long readInterval = 2000; // Interval to update (in milliseconds)
  unsigned long startMillis = millis();
  unsigned long currentMillis = startMillis;
  Serial.print("Force open vault");
  while (millis() - startMillis < 30000)
  { // 30000 milliseconds = 30 seconds
    currentMillis = millis();

    if (currentMillis - previousMillis >= readInterval)
    {
      previousMillis = currentMillis;

      Serial.println("{HI ADMIN DONE FORC OPEN VAULT}");

      // Read our configuration for our LED
      LED ledSetup = extractLEDConfiguration("led_1");
      // Serial.println(ledSetup.sensor_id);
      // Serial.println(ledSetup.description);
      // Serial.println(ledSetup.location);
      // Serial.println(ledSetup.enabled);
      // Serial.println(ledSetup.type);
      // Serial.println(ledSetup.status);
      setLEDStatus(convertStatus(ledSetup.status)); // Set LED value
      Serial.println("{HI ADMIN DONE FORC OPEN VAULT}");
    }
  }
  sendOFFSensorStatus("led_1"); // Turn off sensor status after 9 seconds
}

// if user inputted right values
void OpenSafeVault()
{
  unsigned long startMillis = millis(); // Start time for the 9-second interval

  while (millis() - startMillis < 30000)
  { // Check if less than 30 seconds have passed
    unsigned long currentMillis = millis();

    // This block will execute every 2 seconds
    static unsigned long previousMillis = 0; // 'static' to retain its value across function calls
    if (currentMillis - previousMillis >= 2000)
    { // 2000 milliseconds = 2 seconds
      previousMillis = currentMillis;

      Serial.println("---------------");
      // Read and display LED configuration
      LED ledSetup = extractLEDConfiguration("led_1");
      Serial.println(ledSetup.sensor_id);
      Serial.println(ledSetup.description);
      Serial.println(ledSetup.location);
      Serial.println(ledSetup.enabled);
      Serial.println(ledSetup.type);
      Serial.println(ledSetup.status);
      setLEDStatus(convertStatus(ledSetup.status)); // Set LED value
      Serial.println("---------------");

      // Optionally, read and display IItem configuration
      // Uncomment these lines if needed
      // IItem itemget = extractIItemConfiguration("claim");
      // Serial.println(itemget.item_claim);
      // Serial.println(itemget.item_type);
      // Serial.println(itemget.pin);
      // Serial.println("---------------");
    }
  }

  sendOFFSensorStatus("led_1"); // Turn off sensor status after 9 seconds
}

void displayMessageOnOled(String message)
{
  display.clearDisplay();
  display.setTextSize(1);              // Choose the text size
  display.setTextColor(SSD1306_WHITE); // Choose the text color

  int16_t x1, y1;
  uint16_t w, h;

  // Calculate the bounds of the text to get its width and height
  display.getTextBounds(message, 0, 0, &x1, &y1, &w, &h);

  // Calculate the x and y position to center the text
  int16_t x = (display.width() - w) / 2;
  int16_t y = (display.height() - h) / 2;

  display.setCursor(x, y);             // Set cursor to the calculated position
  display.println(message);
  display.display();
}


int claimItem;

unsigned long previousMillis = 0;
const long interval = 2000;
int overdrive_pass = 2345;
int YouChose = -1;
int YourPin = 0;

void setup()
{

  
  SafeVaultServo.attach(vaultServo1);
  Serial.begin(9600);

  // pinMode(TRIG_PIN, OUTPUT);
  // pinMode(ECHO_PIN, INPUT);
  // pinMode(YellowLED_PIN, OUTPUT);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
  { // Change 0x3C to your OLED's I2C address
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ;
  }
  display.clearDisplay();

  for (uint8_t t = 2; t > 0; t--)
  {
    Serial.printf("[SETUP] WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  // Setup LED
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
}

void loop()
{

  // // Ultrasonic sensor reading and LED control
  // digitalWrite(TRIG_PIN, LOW);
  // delayMicroseconds(2);
  // digitalWrite(TRIG_PIN, HIGH);
  // delayMicroseconds(10);
  // digitalWrite(TRIG_PIN, LOW);

  // long duration = pulseIn(ECHO_PIN, HIGH);
  // int distance = duration * 0.034 / 2; // Convert time to distance

  // // Assuming the threshold distance for an occupied vault is 10 cm
  // if (distance < 10) {
  //   // Vault is occupied, turn Yellow LED off
  //   digitalWrite(YellowLED_PIN, LOW);
  // } else {
  //   // Vault is vacant, turn Yellow LED on
  //   digitalWrite(YellowLED_PIN, HIGH);
  // }

  static char code[5]; // Array to store the 4-digit code, +1 for null terminator
  static int codeIndex = 0;
  char customKey = customKeypad.getKey();

  unsigned long currentMillis = millis();

  // Check if it's time to update the configuration
  if (currentMillis - previousMillis >= interval)
  {
    previousMillis = currentMillis;
    LED ledSetup = extractLEDConfiguration("led_1");
    IItem itemget = extractIItemConfiguration("claim");
    setLEDStatus(convertStatus(ledSetup.status));
  }

  if (customKey)
  {
    if (customKey >= '0' && customKey <= '9')
    {
      YouChose = customKey - '0';
      Serial.println("Please Pick an Option ");
      Serial.print("You chose: ");
      Serial.println(YouChose);

      switch (YouChose)
      {
      case 1:
      {
        Serial.println("Input Pin");

        // Resetting codeIndex and code array for new input
        codeIndex = 0;
        memset(code, 0, sizeof(code)); // Clear the code array

        while (codeIndex < 4)
        { // Wait until 4 digits are entered
          char customKey1 = customKeypad.getKey();

          if (customKey1 && customKey1 >= '0' && customKey1 <= '9')
          {
            code[codeIndex] = customKey1;
            Serial.print(customKey1); // Display each digit as it's entered
            codeIndex++;
            // Update OLED display
            display.clearDisplay();
            display.setTextSize(1);              // Choose the text size
            display.setTextColor(SSD1306_WHITE); // Choose the text color
            display.setCursor(0, 0);             // Set cursor to top-left
            displayMessageOnOled("Enter Pin: ");
            for (int i = 0; i < codeIndex; i++)
            {
              display.print(code[i]);
            }
            display.display();
            delay(50); // Short delay to debounce and slow down input for readability
          }
        }

        code[codeIndex] = '\0'; // Null terminate the string
        YourPin = atoi(code);   // Convert string to integer
        Serial.print("\nYour Pin: ");
        Serial.println(YourPin);

        // sendOFFSensorStatus("led_1");
        LED ledSetup = extractLEDConfiguration("led_1");
        IItem itemget = extractIItemConfiguration("claim");
        // setLEDStatus(convertStatus(ledSetup.status)); // Set LED value

        digitalWrite(LED2, HIGH);
        delay(1000);
        digitalWrite(LED2, LOW);
        delay(1000);
        unsigned long currentMillis = millis();

        // int input_password = Serial.parseInt();

        if (YourPin == 1739)
        {
          displayMessageOnOled("[ADMIN PASS]");
          OverDriveVault();
        }
        else if ((YourPin == itemget.pin))
        {
          displayMessageOnOled("[USER PASS]\nUpdating Values...");
          sendSensorStatus("led_1");
          sendItemClaimType("claim");
          // Put update on item values
          Serial.print("You Inputted: ");
          Serial.println(YourPin);
          Serial.println("Values would be updated");

          OpenSafeVault();
        }
        else
        {
          displayMessageOnOled("[INVALID PASS]\nPlease Enter again");
          sendOFFSensorStatus("led_1");
          Serial.println("Please Enter again");
        }
        break;
      }
      case 2:
        displayMessageOnOled("Vault Resetting");
        sendOFFSensorStatus("led_1");

        break;
      default:
        displayMessageOnOled("SafeVault: Please choose a valid selection");
      }
    }
  }
}

// void setup() {
//   Serial.begin(115200);

//   if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3D for 128x64
//     Serial.println(F("SSD1306 allocation failed"));
//     for(;;);
//   }
//   delay(2000);
//   display.clearDisplay();

//   display.setTextSize(1);
//   display.setTextColor(WHITE);
//   display.setCursor(0, 10);
//   // Display static text
//   display.println("Hello, world!");
//   display.display();
// }

// void loop() {

// }