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
	messageLength_ = i;
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


Status controlFunction() {

	if (!strcmp(payload_, "MOTOR?\0")) {
		if (HAL_UART_Transmit(&huart1, (uint8_t*) &newMotorRotationAngle_,
				strlen(LED_State_), 1000) == HAL_OK) {
		} else
			return ERR;
	} else if (payload_[0] == 'M' && payload_[1] == '_') {
		if (strlen(payload_) == 3) {
			newMotorRotationAngle_ = (payload_[2] - '0');
		} else if (strlen(payload_) == 4) {
			newMotorRotationAngle_ = 10 * (payload_[2] - '0')
					+ (payload_[3] - '0');
		} else if (strlen(payload_) == 5) {
			newMotorRotationAngle_ = 100 * (payload_[2] - '0')
					+ 10 * (payload_[3] - '0') + (payload_[4] - '0');
		}

		if (newMotorRotationAngle_ == oldMotorRotationAngle_) {
			if (HAL_UART_Transmit(&huart1,
					(uint8_t*) "You've transmitted the same rotation angle",
					strlen("You've transmitted the same rotation angle"), 1000)
					== HAL_OK) {
			} else
				return ERR;
			return ERR;
		} else if (newMotorRotationAngle_ < 0 || newMotorRotationAngle_ > 360) {
			if (HAL_UART_Transmit(&huart1,
					(uint8_t*) "You've transmitted the wrong rotation angle",
					strlen("You've transmitted the wrong rotation angle"), 1000)
					== HAL_OK) {
			} else
				return ERR;
			return ERR;
		} else MOTOR_StartFlag_ = 1;
	} else if (!strcmp(payload_, "PMT_ADC\0")) {
		ADC_StartFlag_ = 1;
		TIM_StartFlag_ = 0;
	} else if (!strcmp(payload_, "PMT_TIM\0")) {
		TIM_StartFlag_ = 1;
		ADC_StartFlag_ = 0;
	} else if (!strcmp(payload_, "STOP\0")) {
		ADC_StartFlag_ = 0;
		TIM_StartFlag_ = 0;
	}
	return OK;

}

/*
 * Формируем и отправляем сообщение для отправки по UART (для отладки)
 * Если отправилось, возвращаем OK, иначе ERR
 */
Status transmitMessage() {
	sprintf(transmitBuf_,
			"\r\nReceived data:\r\nDate: %s\r\nTime: %s\r\nPayload: %s\r\n%s",
			date_, time_, payload_, LED_State_);
	if (HAL_UART_Transmit(&huart1, (uint8_t*) &transmitBuf_, getMessageLength(),
			1000) == HAL_OK) {
		return OK;
	} else
		return ERR;
}

/*
 * Возвращаем длину полученного сообщения
 */
uint8_t getMessageLength() {
	return strlen(transmitBuf_);
}
