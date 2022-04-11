#include "../Domains/TypeStruct.h"
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

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


/// Ответ сервера -----------------
void SendResponseMeasure(struct ResponseMeasureStruct dto);
void SendResponseStop(struct ResponseMeasureStruct dto);
void SendResponseResultAction(struct ResponseResultActionStruct dto);
void SendResponseStateStruct(struct ResponseStateStruct dto);