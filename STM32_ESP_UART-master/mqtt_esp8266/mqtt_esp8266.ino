#include <ESP8266WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"

/************************* Параметры WiFi *********************************/

#define WLAN_SSID       "MTSRouter-008073"     //SSID точки доступа WiFi
#define WLAN_PASS       "XKTM6A0F"             //Пароль к точке доступа

/************************* Параметры MQTT *********************************/

#define SERVER      "192.168.1.2"          //Адрес сервера
#define SERVERPORT  1883                   //Порт
#define SERVERID    "test"                 //ID сервера
#define USERNAME    "bud"                  //Имя пользователя
#define PASSWORD    "%spencer%"            //Пароль

#define FROM-TOPIC  "fromesp"              // по какому каналу приходят сообщения
#define TO-TOPIC    "toesp"                // по какому каналу отправляются сообщения
/************************** Настройка клиента **************************/

// Создаем объект класса WiFiClient для подключения к WiFi
WiFiClient client;
// или WiFiClientSecure для SSL
// WiFiClientSecure client;

// Настройка клиента MQTT
Adafruit_MQTT_Client mqtt(&client, SERVER, SERVERPORT, SERVERID, USERNAME, PASSWORD);

// Настройка отправителя
Adafruit_MQTT_Publish publisher = Adafruit_MQTT_Publish(&mqtt, FROM);

// Настройка подписчика
Adafruit_MQTT_Subscribe subscriber = Adafruit_MQTT_Subscribe(&mqtt, TO-TOPIC);

// Прототип функции подключения к серверу
void MQTT_connect();

// Настройка UART (Serial), WiFi и подключение к нему, запуск подписчика
void setup() {
  Serial.begin(115200);
  delay(10);

  Serial.println(F("Adafruit MQTT demo"));

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(WLAN_SSID);

  WiFi.begin(WLAN_SSID, WLAN_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.println("WiFi connected");
  Serial.println("IP address: "); Serial.println(WiFi.localIP());

  mqtt.subscribe(&subscriber);
}

void loop() {
  MQTT_connect();
  Adafruit_MQTT_Subscribe *subscription;
  char buf[16]; // Буфер для сообщения состояния светодиодов

  while ((subscription = mqtt.readSubscription(10000))) { // Ждем принятия сообщения с сервера
    if (subscription == &subscriber) {
      // Отправляем принятое сообщение по UART, добавляя в начале символ начала сообщения '$',
      // а в конце ';'
      Serial.print('$');
      Serial.print((char *)subscriber.lastread); 
      Serial.println(';');

      // Читаем из UART 15 символов, записывая в буфер
      Serial.readBytes(buf, 15);

      // Если получили LED, то отправляем полученный буфер на сервер
      // и очищаем его, чтобы повторно не зайти в условие, не получив сообщения
      if (strstr(buf, "LED"))
      {
        publisher.publish((uint8_t*)&buf, 14);
        memset(buf, '0', 15);
      }
    }
  }
}

// Функция подключения к MQTT серверу
void MQTT_connect() {
  int8_t ret;

  // Если подключено, то выходим из функции
  if (mqtt.connected()) {
    return;
  }

  // Если не подключено, то пытаемся подключиться каждые 5 секунд
  Serial.print("Connecting to MQTT... ");
  while ((ret = mqtt.connect()) != 0) { // connect() возвращает 0, если подключено
    Serial.println(mqtt.connectErrorString(ret));
    Serial.println("Retrying MQTT connection in 5 seconds...");
    mqtt.disconnect();
    delay(5000);  // wait 5 seconds
  }
  Serial.println("MQTT Connected!");
}
