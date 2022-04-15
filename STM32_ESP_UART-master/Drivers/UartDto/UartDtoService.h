#ifndef UARTDTO_UARTDTOSERVICE_H_
#define UARTDTO_UARTDTOSERVICE_H_
#pragma once
#include "string.h"
#include "usart.h"
#include "gpio.h"
#include "adc.h"
#include "string.h"
#include "stdio.h"
#include "TypeStruct.h"
#include <stdint.h>
/// Ответ сервера -----------------
// отправить измерение
void SendResponseMeasure(uint16_t id, uint16_t x, uint32_t y);

// отправить стоп
void SendResponseStop(uint16_t id);

// ответ на успешно отправленное значение
void SentResultActionResponse(struct TypeStruct typeStruct, char err[255], bool stat);

// отправка состояния устройства
void SendResponseStateStruct(struct TypeStruct typeStruct,
		float currentMeasure,
		float voltageCurrent,
		uint8_t resistance,
		uint8_t capacitance);

// отправить ошибку
void SentError(uint8_t *file, uint32_t line);
#endif /* UARTDTO_UARTDTOSERVICE_H_ */
