#include "UartDtoService.h"

/*
 * Эта функция нужна для отладки кода. При вызове
 * отправляет по UART сообщение об ошибке с путем к файлу
 * и номером строки, где данная функция была вызвана
 */
void SentError(uint8_t *file, uint32_t line) {
	char buf[200] = { 0 };
	sprintf(buf, "\r Exception: Wrong parameters value: file %s on line %d\r\n", file, (int) line);
	while (HAL_UART_Transmit(&huart1, (uint8_t*) buf, strlen(buf),10 * strlen(buf)) != HAL_OK);
	HAL_NVIC_SystemReset();
}

void SentResultActionResponse(struct TypeStruct typeStruct, char err[255], bool stat) {
	char resultState[19 + strlen(err)];

	sprintf(
	        resultState,
	        "R_%c%c_%c%c*ERR=%s-STAT=%d",
	         typeStruct.type[0],
	         typeStruct.type[1],
	         typeStruct.subType[0],
	         typeStruct.subType[1],
	         err,
	         stat);

	while (
			HAL_UART_Transmit(&huart1, (uint8_t*) resultState, strlen(resultState), 10 * strlen(resultState)
	) != HAL_OK);
}

// отправляем команду об измерении
/// id - айди операции
/// x - измерения по х (длина волны/время)
/// y - измерения по y (счет/токовый сигнал)
void SendResponseMeasure(uint16_t id, uint16_t x, uint32_t y){
    char measureResult[20];
    sprintf(measureResult, "M_%d-%d-%d", id, x, y);
    HAL_UART_Transmit(&huart1, (uint8_t*) measureResult, strlen(measureResult), 10 * strlen(measureResult));
}

// отправляем команду об остановке измерения окончательной
void SendResponseStop(uint16_t id){

    char resultState[snprintf( NULL, 0, "%d", id ) + 7];

    sprintf(resultState, "M_STOP_%d", id);

    HAL_UART_Transmit(&huart1, (uint8_t*) resultState, strlen(resultState),10 * strlen(resultState));
}

/// отправляем состояние устройства
/// typeStruct - тип выполняемой операции в данный момент
/// currentMeasure - Интенсивность света в данный момент
/// voltageCurrent - Напряжение на фэу
/// resistance - сопротивление текущее на фэу
/// capacitance - Емкость текущая на фэу
void SendResponseStateStruct(
		struct TypeStruct typeStruct,
		float currentMeasure,
		float voltageCurrent,
		uint8_t resistance,
		uint8_t capacitance){

}

