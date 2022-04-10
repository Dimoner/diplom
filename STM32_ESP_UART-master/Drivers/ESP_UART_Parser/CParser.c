#include "CParser.h"

Status receiveSymbol() {
	if (HAL_UART_Receive(&huart1, (uint8_t*) &receivedSymbol_, 1,
	HAL_MAX_DELAY) == HAL_OK)
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
Status receiveMessage() {
	uint8_t i = 0;
	do {
		if (receiveSymbol() == OK) {
			receiveBuf_[i] = receivedSymbol_;
			i++;
		} else
			return ERR;
	} while (receivedSymbol_ != ';');
	receiveBuf_[i] = '\0';
	messageLength_ = i;
	return OK;
}

/*
 * Из полученного сообщения выхватываем дату, время
 * и управляющую команду, раскидываем данные по
 * соответствующим полям
 */
Status parseMessage() {
	uint8_t j = 0;
	for (uint8_t k = 0; k < 10; k++) {
		date_[j] = receiveBuf_[k];
		j++;
	}
	date_[10] = '\0';
	j = 0;
	for (uint8_t k = 11; k < 19; k++) {
		time_[j] = receiveBuf_[k];
		j++;
	}
	time_[8] = '\0';
	j = 33;
	uint8_t i = 0;
	while (receiveBuf_[j] != ';') {
		payload_[i] = receiveBuf_[j];
		i++;
		j++;
	}
	payload_[i] = '\0';
	return OK;
}

/*
 * В зависимости от полученной команды меняем состояние светодиода
 * и записываем его состояние для дальнейшей отправки по UART
 */
Status controlLED() {
	if (!strcmp(payload_, "LED1:1\0"))               //Включение 1-го светодиода
			{
		HAL_GPIO_WritePin(LED1_GPIO_Port, LED1_Pin, GPIO_PIN_SET);
		sprintf(LED_State_, "LED1 State: ON%c", '\0');
	} else if (!strcmp(payload_, "LED1:0\0"))       //Выключение 1-го светодиода
			{
		HAL_GPIO_WritePin(LED1_GPIO_Port, LED1_Pin, GPIO_PIN_RESET);
		sprintf(LED_State_, "LED1 State: OFF%c", '\0');
	} else if (!strcmp(payload_, "LED2:1\0"))        //Включение 2-го светодиода
			{
		HAL_GPIO_WritePin(LED2_GPIO_Port, LED2_Pin, GPIO_PIN_SET);
		sprintf(LED_State_, "LED2 State: ON%c", '\0');
	} else if (!strcmp(payload_, "LED2:0\0"))       //Выключение 2-го светодиода
			{
		HAL_GPIO_WritePin(LED2_GPIO_Port, LED2_Pin, GPIO_PIN_RESET);
		sprintf(LED_State_, "LED2 State: OFF%c", '\0');
	} else if (!strcmp(payload_, "LED?\0"))       //Запрос состояния светодиодов
			{
		uint8_t led1state = (uint8_t) HAL_GPIO_ReadPin(LED1_GPIO_Port,
		LED1_Pin);
		uint8_t led2state = (uint8_t) HAL_GPIO_ReadPin(LED2_GPIO_Port,
		LED2_Pin);
		sprintf(LED_State_, "LED1:%d, LED2:%d%c", led1state, led2state, '\0');
		if (HAL_UART_Transmit(&huart1, (uint8_t*) &LED_State_,
				strlen(LED_State_), 1000) == HAL_OK) {
		} else
			return ERR;
	}
	return OK;
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
