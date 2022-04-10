#include "../Domains/TypeStruct.h"
#include <stdint.h>
#include <intrin.h>
#include <stdbool.h>

/// Парсим тип и подтип из запроса (2_0*DIR={1-часовая/2-против}-WAY={нм} ----> typeStruct)
/// \param receiveBuf
/// \return
struct TypeStruct getTypeStruct(char* receiveBuf);

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