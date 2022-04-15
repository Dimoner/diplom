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

	newGlobalState.typeStruct = getTypeStruct(receiveMessageText);
	char* payload = getPayload(receiveMessageText);

	if (isCheckState(newGlobalState.typeStruct)){
	     return newGlobalState;
	}

	if (isChangePosition(newGlobalState.typeStruct)){
	     newGlobalState.changePositionStruct = getChangePositionStruct(payload);
	     return newGlobalState;
	}

	if (isDetectAmperageRange(newGlobalState.typeStruct)){
	     newGlobalState.detectAmperageRangeStruct = getDetectAmperageRangeStruct(payload);
	     return newGlobalState;
	}

	if (isDetectAmperageTime(newGlobalState.typeStruct)){
		newGlobalState.detectAmperageTimeStruct = getDetectAmperageTimeStruct(payload);
	    return newGlobalState;
	}

	if (isDetectTickRange(newGlobalState.typeStruct)){
	    return newGlobalState;
	}

	if (isDetectTickTime(newGlobalState.typeStruct)){
	   return newGlobalState;
	}

	return newGlobalState;
}
