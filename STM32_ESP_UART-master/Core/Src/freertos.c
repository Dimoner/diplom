#include "FreeRTOS.h"
#include "task.h"
#include "main.h"
#include "cmsis_os.h"
#include "CParser.h"
#include "RequestResponseParser.h"
#include "TypeStruct.h"
#include "queue.h"
#include "tim.h"
#include "UartDtoService.h"
/*
 * Глобальное состояние устройства в данный момент
 */
struct GlobalStateStruct globalState;


osThreadId_t myTaskUARTHandle;
const osThreadAttr_t myTaskUART_attributes = { .name = "myTaskUART",
		.stack_size = 128 * 4, .priority = (osPriority_t) osPriorityNormal, };
/* Definitions for myTaskMotor */

osThreadId_t myTaskMotorHandle;
const osThreadAttr_t myTaskMotor_attributes = { .name = "myTaskMotor",
		.stack_size = 128 * 4, .priority = (osPriority_t) osPriorityNormal, };
/* Definitions for myTaskPMT */

osThreadId_t myTaskPMTHandle;
const osThreadAttr_t myTaskPMT_attributes = { .name = "myTaskPMT", .stack_size =
		128 * 4, .priority = (osPriority_t) osPriorityNormal, };

/* Definitions for myQueue01 */
osMessageQueueId_t myQueue01Handle;
const osMessageQueueAttr_t myQueue01_attributes = { .name = "myQueue01" };

/* Definitions for myQueue02 */
osMessageQueueId_t myQueue02Handle;
const osMessageQueueAttr_t myQueue02_attributes = { .name = "myQueue02" };

/* Definitions for myBinarySem01 */
osSemaphoreId_t myBinarySem01Handle;
const osSemaphoreAttr_t myBinarySem01_attributes = { .name = "myBinarySem01" };


void StartDefaultTask(void *argument);
void StartTaskUART(void *argument);
void StartTaskMOTOR(void *argument);
void StartTaskPMT(void *argument);

void MX_FREERTOS_Init(void); /* (MISRA C 2004 rule 8.1) */

void vApplicationStackOverflowHook(xTaskHandle xTask, signed char *pcTaskName);

void vApplicationStackOverflowHook(xTaskHandle xTask, signed char *pcTaskName) {
	/* Run time stack overflow checking is performed if
	 configCHECK_FOR_STACK_OVERFLOW is defined to 1 or 2. This hook function is
	 called if a stack overflow is detected. */
}

/**
 * @brief  FreeRTOS initialization
 * @param  None
 * @retval None
 */
void MX_FREERTOS_Init(void) {

	myBinarySem01Handle = osSemaphoreNew(1, 1, &myBinarySem01_attributes);

	myQueue01Handle = osMessageQueueNew(16, sizeof(uint8_t),&myQueue01_attributes);
	myQueue02Handle = osMessageQueueNew(16, sizeof(uint8_t),&myQueue02_attributes);

	myTaskUARTHandle = osThreadNew(StartTaskUART, NULL, &myTaskUART_attributes);
	myTaskMotorHandle = osThreadNew(StartTaskMOTOR, NULL, &myTaskMotor_attributes);
	myTaskPMTHandle = osThreadNew(StartTaskPMT, NULL, &myTaskPMT_attributes);
}

/*
 * Задача для чтения сообщения из UART
 */
void StartTaskUART(void *argument) {
	for (;;) {
		// 1 - получили символ и проверии, что это стартовый
		bool isStartReadUart = receiveSymbol() == OK && checkStartOfMessage() == OK;
		if (!isStartReadUart) {
			SentError((uint8_t*) __FILE__, __LINE__);
			continue;
		}

		// 2 - читаем остальную часть строки в receiveMessageText
		char receiveMessageText[200];
		bool receiveMessageResult = receiveMessage(receiveMessageText) == OK;
		if (!receiveMessageResult) {
			SentError((uint8_t*) __FILE__, __LINE__);
			continue;
		}

		// 3 - записываем новое глобальное состояние систему
		struct GlobalStateStruct parseMessageResult = getNewGlobalState(receiveMessageText);
		globalState = parseMessageResult;

		osDelay(1);
	}
}

/* USER CODE BEGIN Header_StartTaskMOTOR */
/**
 * @brief Function implementing the myTaskMotor thread.
 * @param argument: Not used
 * @retval None
 */
/* USER CODE END Header_StartTaskMOTOR */
void StartTaskMOTOR(void *argument) {
	for (;;) {
		// 1 - дожидаемся пока придем команда для изменения положения шагового двигателя
		if(isChangePosition(globalState.typeStruct) && !globalState.isExistActiveAction){
			globalState.isExistActiveAction = true;

			// 2 - устанавливаем вращение
			// true - часовая / false - против часовой
			if(globalState.changePositionStruct.dir){
				HAL_GPIO_WritePin(MOTOR_Port, DIR_Pin, GPIO_PIN_SET);
			} else {
				HAL_GPIO_WritePin(MOTOR_Port, DIR_Pin, GPIO_PIN_SET);
			}

			// 3 - определяем кол-во шим сигналов для вращения
			uint32_t totalRate = globalState.changePositionStruct.way * 2000;

			// 4 - вращаем щаговый двигатель
			for (uint32_t i = 0; i < totalRate; i++) {
				HAL_GPIO_WritePin(MOTOR_Port, STEP_Pin, GPIO_PIN_SET);
				osDelay(4);
				//HAL_Delay(1);
				/*for (j = 0; j < 2500; j++) {

				}*/
				HAL_GPIO_WritePin(MOTOR_Port, STEP_Pin, GPIO_PIN_RESET);
				osDelay(4);
				//HAL_Delay(1);
				/*for (j = 0; j < 5000; j++) {

				}*/
			}

			// 5 - отправляем состояние ответа по UART---------------
			SentResultActionResponse(globalState.typeStruct, "", 1);

			// ------------------------------------------------------

			// 6 - сбрасываем команду -------------------------------
			struct TypeStruct resetActionType;
			struct ChangePositionStruct resetChangePosition;
			globalState.isExistActiveAction = false;
			globalState.typeStruct = resetActionType;
			globalState.changePositionStruct = resetChangePosition;
			// ------------------------------------------------------
		}
		osDelay(1);
	}
}

/* USER CODE BEGIN Header_StartTaskPMT */
/**
 * @brief Function implementing the myTaskPMT thread.
 * @param argument: Not used
 * @retval None
 */
/* USER CODE END Header_StartTaskPMT */
void StartTaskPMT(void *argument) {
	/* USER CODE BEGIN StartTaskPMT */
	uint16_t ADC_value = 0;
	uint8_t averageFactor = 0;
	uint16_t ADC_oldValue = 0;
	HAL_ADCEx_Calibration_Start(&hadc1);

	/* Infinite loop */

	for (;;) {
		if (ADC_StartFlag_) {

			HAL_GPIO_WritePin(Relay_OUT_GPIO_Port, Relay_OUT_Pin, GPIO_PIN_SET);
			uint32_t currentTime = HAL_GetTick();
			do {
				HAL_ADC_Start(&hadc1);
				ADC_value = (uint16_t) HAL_ADC_GetValue(&hadc1);
				HAL_ADC_Stop(&hadc1);
				if (averageFactor > 0) {
					ADC_oldValue = ADC_value;
					ADC_value = (uint16_t) ((ADC_oldValue * (averageFactor - 1)
							+ ADC_value) / averageFactor);
				}
			} while (HAL_GetTick() - currentTime < 1000);
			sprintf(PMT_State_, "PMT_ADC=%d%c", ADC_value, '\0');

			if (HAL_UART_Transmit(&huart1, (uint8_t*) &PMT_State_, strlen(PMT_State_), 1000) == HAL_OK) {

			}
		} else if (TIM_StartFlag_) {
			HAL_TIM_Base_Start(&htim2);
			HAL_TIM_Base_Start(&htim3);
			HAL_TIM_Base_Start_IT(&htim1);
			sprintf(PMT_State_, "PMT_TIM=%d%c", freq_, '\0');
			if (HAL_UART_Transmit(&huart1, (uint8_t*) &PMT_State_,
					strlen(PMT_State_), 1000) == HAL_OK) {
			}
		}
		osDelay(1);
	}
	/* USER CODE END StartTaskPMT */
}

//Функция-обработчик прерываний таймеров
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
	if (htim == &htim1) {
		uint16_t TIM2_count = __HAL_TIM_GET_COUNTER(&htim2);
		//Значение счетчика таймера TIM2
		//(Количество последних подсчитанных
		//импульсов к моменту прерывания)
		uint16_t TIM2_overflows = __HAL_TIM_GET_COUNTER(&htim3);
		//Значение счетчика таймера TIM3
		freq_ = TIM2_count + (TIM2_overflows * 65535) + TIM2_overflows;
        //Вычисление частоты
        //Установка флага окончания измерения частоты
		__HAL_TIM_SET_COUNTER(&htim2, 0x0000);
        //Обнуление счетчиков таймеров 2 и 3
		__HAL_TIM_SET_COUNTER(&htim3, 0x0000);
	}
}
