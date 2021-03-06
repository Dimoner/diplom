#ifndef HELPERSLOGIC_REQUESTRESPONSEPARSER_H_
#define HELPERSLOGIC_REQUESTRESPONSEPARSER_H_
#pragma once

#include "TypeStruct.h"
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

// зануление всех элементов char[]
void clean(char *var);

/// Парсим тип и подтип из запроса (2_0*DIR={1-часовая/2-против}-WAY={нм} ----> typeStruct)
/// \param receiveBuf
/// \return
struct TypeStruct getTypeStruct(char receiveBuf[200]);

/// получение полезной нагрузки запроса
char* getPayload(char requestPayload[]);

/// получение состояния смены шага
struct ChangePositionStruct getChangePositionStruct(char requestPayload[]);

/// получение состояния измерения тока на диапозоне длины волны
struct DetectAmperageRangeStruct getDetectAmperageRangeStruct(char requestPayload[]);

/// получение состояния измерения тока в 1 точке от времени
struct DetectAmperageTimeStruct getDetectAmperageTimeStruct(char requestPayload[]);
#endif /* HELPERSLOGIC_REQUESTRESPONSEPARSER_H_ */
