#ifndef CPARSER_H_
#define CPARSER_H_
#pragma once

#include "main.h"
#include "usart.h"
#include "gpio.h"
#include "adc.h"
#include "string.h"
#include "stdio.h"
#include <stdlib.h>

/*
 * Объявление типа Status, OK(ERR) будет возвращаться
 * функциями при успешном(безуспешном) выполнении
 */
typedef enum {
	OK = 0, ERR = 1
} Status;

Status receiveSymbol();               //Прием символа по UART
Status checkStartOfMessage();             //Поиск начала сообщения (символа '$')
Status parseMessage();               //Парсинг сообщения
Status controlLED();               //Управление светодиодом
Status controlFunction();               //Управление шаговым двигателем
Status transmitMessage();               //Отправить пакет по UART (для отладки)
Status receiveMessage();               //Принять сообщение по UART

uint8_t getMessageLength();         //Получить длину принятого по UART сообщения

char LED_State_[20];               //Буфер для записи состояния светодиода
char PMT_State_[20];
char transmitBuf_[200];        //Буфер для отправляемого сообщения (для отладки)
char receiveBuf_[200];               //Буфер для принимаемого сообщения
char receivedSymbol_;               //Принимаемый символ по UART
uint8_t messageLength_;               //Длина принятого сообщения

/*Данные, полученные после парсинга принятого сообщения*/

char date_[15];               //Дата
char time_[15];               //Время
char payload_[15];               //Данные

uint8_t oldMotorRotationAngle_;
uint8_t newMotorRotationAngle_;

uint8_t MOTOR_StartFlag_;
uint8_t ADC_StartFlag_;
uint8_t TIM_StartFlag_;
int freq_;
#endif /* CPARSER_H_ */
