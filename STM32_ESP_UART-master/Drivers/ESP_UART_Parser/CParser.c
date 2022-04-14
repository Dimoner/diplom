#include "CParser.h"

Status receiveSymbol() {
	if (HAL_UART_Receive(&huart1, (uint8_t*) &receivedSymbol_, 1, HAL_MAX_DELAY) == HAL_OK)
		return OK;
	else
		return ERR;
}

/*
 * Если принятый символ '$' (начало пакета), то возвращаем OK, иначе ERR
 */
Status checkStartOfMessage() {
	if (receivedSymbol_ == '$') {
		return OK;
	} else
		return ERR;
}

/*
 * Читаем символы из UART, пока не встретим ';' (конец пакета),
 * в конце ставим символ конца строки и возвращаем OK
 * Если произошла ошибка при чтении, возвращаем ERR
 */
Status receiveMessage(char* outMessage) {
	uint8_t i = 0;
	do {
		if (receiveSymbol() == OK) {
			outMessage[i] = receivedSymbol_;
			i++;
		} else
			return ERR;
	} while (receivedSymbol_ != ';');
	outMessage[i] = '\0';
	return OK;
}

/*
 * Из полученного сообщения выхватываем дату, время
 * и управляющую команду, раскидываем данные по
 * соответствующим полям
 */
struct GlobalStateStruct getNewGlobalState(char receiveMessageText[200]) {
	struct GlobalStateStruct newGlobalState;

	struct TypeStruct actionType = getTypeStruct(receiveMessageText);
	newGlobalState.typeStruct = actionType;
	char* payload = getPayload(receiveMessageText);

	if (isCheckState(actionType)){
	     return newGlobalState;
	}

	if (isChangePosition(actionType)){
	     newGlobalState.changePositionStruct = getChangePositionStruct(payload);
	     return newGlobalState;
	}

	if (isDetectAmperageRange(actionType)){
	     newGlobalState.detectAmperageRangeStruct = getDetectAmperageRangeStruct(payload);
	     return newGlobalState;
	}

	if (isDetectAmperageTime(actionType)){
	   return newGlobalState;
	}

	if (isDetectTickRange(actionType)){
	    return newGlobalState;
	}

	if (isDetectTickTime(actionType)){
	   return newGlobalState;
	}

	if (isContinueMeasure(actionType)){
	   return newGlobalState;
	}

	if (isPauseMeasure(actionType)){
	   return newGlobalState;
	}

	if (isStopMeasure(actionType)){
	   return newGlobalState;
	}

	return newGlobalState;
}
