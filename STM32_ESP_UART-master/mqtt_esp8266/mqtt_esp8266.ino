#include <ESP8266WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"

/************************* Параметры WiFi *********************************/

#define WLAN_SSID       "iPhone (SERGEY)"     //SSID точки доступа WiFi
#define WLAN_PASS       "365328199"             //Пароль к точке доступа

/************************* Параметры MQTT *********************************/

#define SERVER      "172.20.10.3"          //Адрес сервера
#define SERVERPORT  1883                  //Порт
#define SERVERID    "esp"                 //ID сервера
#define USERNAME    "bud"                  //Имя пользователя
#define PASSWORD    "%spencer%"            //Пароль

#define FROMTOPIC  "fromesp"              // по какому каналу приходят сообщения
#define TOTOPIC    "toesp"                // по какому каналу отправляются сообщения
/************************** Настройка клиента **************************/

// Создаем объект класса WiFiClient для подключения к WiFi
WiFiClient client;
// или WiFiClientSecure для SSL
// WiFiClientSecure client;

// Настройка клиента MQTT
Adafruit_MQTT_Client mqtt(&client, SERVER, SERVERPORT, SERVERID, USERNAME, PASSWORD);

// Настройка отправителя
Adafruit_MQTT_Publish publisher = Adafruit_MQTT_Publish(&mqtt, FROMTOPIC);

// Настройка подписчика
Adafruit_MQTT_Subscribe subscriber = Adafruit_MQTT_Subscribe(&mqtt, TOTOPIC);

// Прототип функции подключения к серверу
void MQTT_connect();


 
// Настройка UART (Serial), WiFi и подключение к нему, запуск подписчика
void setup() {
  // Настройка UART (Serial)
  Serial.begin(115200);
  delay(10);

  // Настройка WiFi и подключение к нему, запуск подписчика
  Serial.print("Connecting to ");
  Serial.println(WLAN_SSID);
  WiFi.begin(WLAN_SSID, WLAN_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  mqtt.subscribe(&subscriber);
  
}

void loop() {
  char buf[20];
  MQTT_connect();
  Adafruit_MQTT_Subscribe *subscription;

  while (true) { // Ждем принятия сообщения с сервера

    // если нам пришло что то по UART отправляем это в mqtt
    if(Serial.available() > 0){
      // TODO на большой скорости он собирает пакеты в общие
      Serial.readBytesUntil(';', buf, 20);
      
      if (mqtt.connected()) {
         publisher.publish((uint8_t*)&buf, 19);
         memset(buf, '0', 19);
      }else {
        MQTT_connect();
        publisher.publish((uint8_t*)&buf, 19);
        memset(buf, '0', 19);
      }
    }

    // если нам пришло что то по mqtt отправляем это в uart
    if((subscription = mqtt.readSubscription(1))){
        if (subscription == &subscriber) {
          Serial.print('$');
          Serial.print((char *)subscriber.lastread); 
          Serial.println(';');
       }   
    }
  
  }
}

// Функция подключения к MQTT серверу
void MQTT_connect() {
  int8_t ret;
  Serial.print("Connecting to MQTT... ");
  // Если подключено, то выходим из функции
  if (mqtt.connected()) {
    return;
  }
  Serial.print(mqtt.connected());
  // Если не подключено, то пытаемся подключиться каждые 5 секунд
  Serial.print("Connecting to MQTT... ");
  while ((ret = mqtt.connect()) != 0) { // connect() возвращает 0, если подключено
    Serial.print(ret);
    //Serial.println(mqtt.connectErrorString(ret));
    Serial.println("Retrying MQTT connection in 5 seconds...");
    Serial.print(mqtt.connected());
    //mqtt.disconnect();
    Serial.print(mqtt.connected());
    delay(5000);  // wait 5 seconds
  }
  Serial.println("MQTT Connected!");
}
