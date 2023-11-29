#include <Arduino.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

#define LED1 13
#define LED2 12

// SSID and Password
const char *ssid = "ZTE_2.4G_XshuY9";
const char *password = "PukNTRu3";
// const char *ssid = "RoomSaCute2.4G";
// const char *password = "123#Colawin#123";

/**** NEED TO CHANGE THIS ACCORDING TO YOUR SETUP *****/
// The REST API endpoint - Change the IP Address
// const char *base_rest_url = "http://192.168.100.22:5000/";
const char *base_rest_url = "http://192.168.1.20:5000/";

WiFiClient client;
HTTPClient http;

// Read interval
unsigned long previousMillis = 0;
const long readInterval = 5000;

struct LED
{
  char sensor_id[10];
  char description[20];
  char location[20];
  bool enabled;
  char type[20];
  char status[10];
};

const int JSON_DOC_SIZE = 500;
// HTTP GET Call
StaticJsonDocument<JSON_DOC_SIZE> callHTTPGet(const char *sensor_id)
{
  char rest_api_url[200];
  // Calling our API server
  sprintf(rest_api_url, "%sapi/sensors/%s", base_rest_url, sensor_id);
  Serial.println(rest_api_url);

  http.useHTTP10(true);
  http.begin(client, rest_api_url);
  http.addHeader("Content-Type", "application/json");
  http.GET();
  StaticJsonDocument<JSON_DOC_SIZE> doc;
  // Parse response
  DeserializationError error = deserializeJson(doc, http.getStream());

  if (error)
  {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return doc;
  }

  http.end();
  return doc;
}

// Extract LED records
LED extractLEDConfiguration(const char *sensor_id)
{
    StaticJsonDocument<JSON_DOC_SIZE> doc = callHTTPGet(sensor_id);
    if (doc.isNull()) {
        Serial.println("JSON document is null");
        return {}; // or LED{}
    }

    if (!doc.is<JsonArray>()) {
        Serial.println("JSON document is not an array");
        return {}; // or LED{}
    }

    for (JsonObject item : doc.as<JsonArray>())
    {
        LED ledTemp = {};

        if (item.containsKey("sensor_id")) {
            strncpy(ledTemp.sensor_id, item["sensor_id"] | "", sizeof(ledTemp.sensor_id));
        }

        if (item.containsKey("description")) {
            strncpy(ledTemp.description, item["description"] | "", sizeof(ledTemp.description));
        }

        if (item.containsKey("location")) {
            strncpy(ledTemp.location, item["location"] | "", sizeof(ledTemp.location));
        }

        ledTemp.enabled = item["enabled"] | false;

        if (item.containsKey("type")) {
            strncpy(ledTemp.type, item["type"] | "", sizeof(ledTemp.type));
        }

        if (item.containsKey("value")) {
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
    Serial.println("Setting LED to HIGH");
    return HIGH;
  }
  else
  {
    Serial.println("Setting LED to LOW");
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

void setup()
{
  Serial.begin(9600);
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
  digitalWrite(LED2, HIGH);
  delay(1000);
  digitalWrite(LED2, LOW);
  delay(1000);
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= readInterval)
  {
    // save the last time
    previousMillis = currentMillis;

    Serial.println("---------------");
    // Read our configuration for our LED
    LED ledSetup = extractLEDConfiguration("led_1");
    Serial.println(ledSetup.sensor_id);
    Serial.println(ledSetup.description);
    Serial.println(ledSetup.location);
    Serial.println(ledSetup.enabled);
    Serial.println(ledSetup.type);
    Serial.println(ledSetup.status);
    setLEDStatus(convertStatus(ledSetup.status)); // Set LED value// Set LED value

    Serial.println("---------------");
  }
}

