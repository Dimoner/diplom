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
void SendResponseMeasure(uint16_t id, float x, float y);
void SendResponseStop(uint16_t id);
void SentResultActionResponse(struct TypeStruct typeStruct, char err[255], bool stat);
void SendResponseStateStruct(struct TypeStruct typeStruct,
		float currentMeasure,
		float voltageCurrent,
		uint8_t resistance,
		uint8_t capacitance);

void SentError(uint8_t *file, uint32_t line);
#endif /* UARTDTO_UARTDTOSERVICE_H_ */
