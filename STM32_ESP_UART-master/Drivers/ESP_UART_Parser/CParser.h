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
#include "TypeStruct.h"
#include "RequestResponseParser.h"

/*
 * Объявление типа Status, OK(ERR) будет возвращаться
 * функциями при успешном(безуспешном) выполнении
 */
typedef enum {
	OK = 0, ERR = 1
} Status;

Status receiveSymbol();               //Прием символа по UART
Status checkStartOfMessage();             //Поиск начала сообщения (символа '$')
Status controlFunction();               //Управление шаговым двигателем
Status transmitMessage();               //Отправить пакет по UART (для отладки)
Status receiveMessage(char* outMessage);               //Принять сообщение по UART

uint8_t getMessageLength();         //Получить длину принятого по UART сообщения

struct GlobalStateStruct getNewGlobalState(char receiveMessageText[200]);               //Парсинг сообщения

//Буфер для записи состояния светодиода
char PMT_State_[20];
//Буфер для отправляемого сообщения (для отладки)
char transmitBuf_[200];
//Буфер для принимаемого сообщения
char receiveBuf_[200];
//Принимаемый символ по UART
char receivedSymbol_;

/*Данные, полученные после парсинга принятого сообщения*/
int freq_;
#endif /* CPARSER_H_ */
