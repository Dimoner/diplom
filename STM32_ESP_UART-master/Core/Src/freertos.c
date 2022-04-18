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
struct GlobalStateStruct pauseState;
bool globalStopFlag = false;
bool globalPauseFlag = false;
void resetGlobalState(){
	globalStopFlag = false;
	globalPauseFlag = false;
	globalState.isExistActiveAction = false;

	globalState.typeStruct.subType[0] = '0';
	globalState.typeStruct.subType[1] = '0';
	globalState.typeStruct.type[0] = '0';
	globalState.typeStruct.type[1] = '0';

	globalState.changePositionStruct.dir = false;
	globalState.changePositionStruct.id = 0;
	globalState.changePositionStruct.way = 0;

	globalState.detectAmperageRangeStruct.id = 0;
	globalState.detectAmperageRangeStruct.dir = false;
	globalState.detectAmperageRangeStruct.way = 0;
	globalState.detectAmperageRangeStruct.step = 0;
	globalState.detectAmperageRangeStruct.count = 0;
	globalState.detectAmperageRangeStruct.cur = 0;
	globalState.detectAmperageRangeStruct.speed = 0;

	globalState.detectAmperageTimeStruct.id = 0;
	globalState.detectAmperageTimeStruct.count = 0;
	globalState.detectAmperageTimeStruct.pointCount = 0;
	globalState.detectAmperageTimeStruct.currentPointCount = 0;
	globalState.detectAmperageTimeStruct.freq = 0;
}

void copyGlobalStateToPause(struct GlobalStateStruct from){
	pauseState = from;
}

void copyGlobalStateFromPause(struct GlobalStateStruct from){
	globalState = from;
	globalState.isExistActiveAction = false;
}

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
		clean(receiveMessageText);

		// 4 - если это проверка состояния сразу отвечае
		if (isCheckState(parseMessageResult.typeStruct))
		{
			SentResultActionResponse(parseMessageResult.typeStruct, "", 1);
			continue;
		}

		// 5 - если это команда стоп
		if (isStopMeasure(parseMessageResult.typeStruct))
		{
			globalStopFlag = true;
			continue;
		}

		// 6 - если это команда паузы
		if (isPauseMeasure(parseMessageResult.typeStruct))
		{
			globalPauseFlag = true;
			continue;
		}

		// 6 - если это команда продолжения после паузы
		if (isContinueMeasure(parseMessageResult.typeStruct))
		{
			copyGlobalStateFromPause(pauseState);
			continue;
		}

		globalState = parseMessageResult;

		osDelay(1);
	}
}

// сколько всего шим сигналов
uint32_t totalRate = 0;
uint32_t currentRate = 0;
// в каком сейчас состоянии пин
bool isSetMotorPin = false;
// счетчики увеличения скорости (вниз вверх)
uint8_t speedChangeFactor = 0;
uint8_t speedDownChangeFactor = 0;
// сколько раз изменилось положение пина
uint8_t countSetPin = 0;

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
			speedChangeFactor = 0;
			speedDownChangeFactor = 0;
			isSetMotorPin = false;
			totalRate = 0;
			currentRate = 0;
			globalState.isExistActiveAction = true;

			// 2 - устанавливаем вращение
			// true - часовая / false - против часовой
			if(globalState.changePositionStruct.dir){
				HAL_GPIO_WritePin(MOTOR_Port, DIR_Pin, GPIO_PIN_RESET);
			} else {
				HAL_GPIO_WritePin(MOTOR_Port, DIR_Pin, GPIO_PIN_SET);
			}

			// 3 - определяем кол-во шим сигналов для вращения
			totalRate = globalState.changePositionStruct.way * 1000;
			currentRate = globalState.changePositionStruct.way * 1000;
			HAL_TIM_Base_Start_IT(&htim1);
		}

		osDelay(1);
	}
}

// логика измерения с усреднением
uint32_t measureAmperageRangeItem(uint16_t count){
	uint32_t ADC_value = 0;
	HAL_ADC_Start(&hadc1);
	//HAL_ADC_PollForConversion(&hadc1, 100);
	for (int i = 0; i < count; i++) {

		if(ADC_value == 0){
			ADC_value = HAL_ADC_GetValue(&hadc1);
	    }else {
			ADC_value = (HAL_ADC_GetValue(&hadc1) + ADC_value) / 2;
		}
	}
	HAL_ADC_Stop(&hadc1);
	return ADC_value;
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

	/* Infinite loop */
	for (;;) {
		if(globalState.isExistActiveAction){
			continue;
		}

		//ток на промежутке
		if (isDetectAmperageRange(globalState.typeStruct))
		{
			// 0 - отправляем команду о начале измерения
			SentResultActionResponse(globalState.typeStruct, "", 1);

			globalState.isExistActiveAction = true;
			// 1 - выполняем измерение в 1 точке
			SendResponseMeasure(
					globalState.detectAmperageRangeStruct.id,
					globalState.detectAmperageRangeStruct.cur,
					measureAmperageRangeItem(globalState.detectAmperageRangeStruct.count));

			// 2 - задаем направление последующих измерений
			if(globalState.detectAmperageRangeStruct.dir){
				HAL_GPIO_WritePin(MOTOR_Port, DIR_Pin, GPIO_PIN_RESET);
			} else {
				HAL_GPIO_WritePin(MOTOR_Port, DIR_Pin, GPIO_PIN_SET);
			}

			// 3 - высчитываем сколько шагов надо совершить
			uint32_t totalMeasureWay =  globalState.detectAmperageRangeStruct.way * 1000;

			// 4 - определяем на каком кол-ве сигналов надо снять измерение
			uint32_t stepCount = globalState.detectAmperageRangeStruct.step * 1000;

			// 5 - задаем текущий счетчик
			uint32_t currentCount = 0;

			// 6 - запускам процесс преодаления промежутка
			for (uint32_t i = 0; i < totalMeasureWay; i++) {
				// если пришла команда на закончить, то завершаем все действия
				if(globalStopFlag){
					i = totalMeasureWay + 1;
					continue;
				}
				// если пришла команда на паузу, то заканчиваем все, но сохраняем предыдушее состояние
				if(globalPauseFlag){
					if(globalState.detectAmperageRangeStruct.dir){
						globalState.detectAmperageRangeStruct.cur = globalState.detectAmperageRangeStruct.cur + (i / 10);
					} else {
						globalState.detectAmperageRangeStruct.cur = globalState.detectAmperageRangeStruct.cur - (i / 10);
					}

					globalState.detectAmperageRangeStruct.way = (totalMeasureWay - i + (stepCount - currentCount)) / 1000;
					copyGlobalStateToPause(globalState);
					i = totalMeasureWay + 1;
					continue;
				}
				HAL_GPIO_WritePin(MOTOR_Port, STEP_Pin, GPIO_PIN_RESET);
                osDelay(globalState.detectAmperageRangeStruct.speed);
                HAL_GPIO_WritePin(MOTOR_Port, STEP_Pin, GPIO_PIN_SET);
                osDelay(globalState.detectAmperageRangeStruct.speed);

                if(currentCount == stepCount){
                	SendResponseMeasureIT(
                			globalState.detectAmperageRangeStruct.id,
							globalState.detectAmperageRangeStruct.cur + (i / 10),
							measureAmperageRangeItem(globalState.detectAmperageRangeStruct.count)
							);
                	currentCount = 0;
                	// нм --- шаги --- ответ по x
                	// 0,01   10       1
                	// 1      1000     100
                	// 10     10000    1000
                }
                currentCount += 1;
			}


			if(globalPauseFlag == false){
				// финальный замер
				SendResponseMeasure(
					globalState.detectAmperageRangeStruct.id,
					globalState.detectAmperageRangeStruct.cur + totalMeasureWay,
					measureAmperageRangeItem(globalState.detectAmperageRangeStruct.count)
				);

				// 7 - сообщяем об окончании процесса измерения
				SendResponseStop(globalState.detectAmperageRangeStruct.id);
			}

			// 8 - сбрасываем состояния в конце измерения
			resetGlobalState();
		}

		// ток в точке от времени
		if (isDetectAmperageTime(globalState.typeStruct))
		{
			// 0 - отправляем команду о начале измерения
			SentResultActionResponse(globalState.typeStruct, "", 1);

			globalState.isExistActiveAction = true;
			// 1 - выполняем измерение в 1 точке
			SendResponseMeasure(
					globalState.detectAmperageTimeStruct.id,
					0,
					measureAmperageRangeItem(globalState.detectAmperageTimeStruct.count)
			);

			// 6 - запускам процесс преодаления промежутка
			for (uint32_t i = globalState.detectAmperageTimeStruct.currentPointCount; i < globalState.detectAmperageTimeStruct.pointCount; i++) {
				// если пришла команда на закончить, то завершаем все действия
				if(globalStopFlag){
					break;
				}

				// если пришла команда на паузу, то заканчиваем все, но сохраняем предыдушее состояние
				if(globalPauseFlag){
					globalState.detectAmperageTimeStruct.currentPointCount = i;
					copyGlobalStateToPause(globalState);
					break;
				}

			    osDelay(globalState.detectAmperageTimeStruct.freq);

			    SendResponseMeasure(
			    	globalState.detectAmperageTimeStruct.id,
			    	i,
			    	measureAmperageRangeItem(globalState.detectAmperageTimeStruct.count)
			    );
			}

			if(globalPauseFlag == false){
				// финальный замер
				SendResponseMeasure(
					globalState.detectAmperageTimeStruct.id,
					globalState.detectAmperageTimeStruct.pointCount,
					measureAmperageRangeItem(globalState.detectAmperageTimeStruct.count)
				);

				// 7 - сообщяем об окончании процесса измерения
				SendResponseStop(globalState.detectAmperageTimeStruct.id);
			}

			// 8 - сбрасываем состояния в конце измерения
			resetGlobalState();
		}

		// счет на промежутке
		if (isDetectTickRange(globalState.typeStruct))
		{
			HAL_TIM_Base_Start(&htim2);
			HAL_TIM_Base_Start(&htim3);
			HAL_TIM_Base_Start_IT(&htim1);
			sprintf(PMT_State_, "PMT_TIM=%d%c", freq_, '\0');
			if (HAL_UART_Transmit(&huart1, (uint8_t *)&PMT_State_, strlen(PMT_State_), 1000) == HAL_OK)
			{
			}
		}

		// счет в точке от времени
		if (isDetectTickTime(globalState.typeStruct))
		{
		}

		osDelay(1);
	}
	/* USER CODE END StartTaskPMT */
}


// начальная скорость
const uint32_t currentSpeed = 10000;
// рубикон ускорения/замедления
const uint16_t changeSpeedLine = 6000;
// шаг изменения скорости по нм
const uint8_t speedChangeStep = 100;
// шаг изменения скорости по сигналу
const uint8_t speedChangeStepCount = 130;
//Функция-обработчик прерываний таймеров
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
	 /* USER CODE BEGIN Callback 0 */
	// логика вращения шаговым двигателем
    if (htim->Instance == TIM1) {
    	// если прошли путь или получили глобальную команду на остановку
    	if(currentRate == 0 || globalStopFlag){
    		HAL_TIM_Base_Stop_IT(&htim1);
			__HAL_TIM_SET_PRESCALER(&htim1, currentSpeed);

    		// 5 - отправляем состояние ответа по UART---------------
    		SentResultActionResponse(globalState.typeStruct, "", 1);

    		// ------------------------------------------------------

    		// 6 - сбрасываем команду -------------------------------
    		resetGlobalState();
    		// ------------------------------------------------------
    		speedChangeFactor = 0;
    		speedDownChangeFactor = 0;
    		totalRate = 0;
    		currentRate = 0;
    		return;
    	}

    	if(isSetMotorPin){
    		HAL_GPIO_WritePin(MOTOR_Port, STEP_Pin, GPIO_PIN_RESET);
    		isSetMotorPin = false;
    		countSetPin += 1;
    	} else {
    		HAL_GPIO_WritePin(MOTOR_Port, STEP_Pin, GPIO_PIN_SET);
    		isSetMotorPin = true;
    		countSetPin += 1;
    	}

    	if(countSetPin == 2){
    		currentRate -= 1;
    		countSetPin = 0;
    	}

    	if(totalRate > (changeSpeedLine * 2 + 100)){
    		if(currentRate == (totalRate - (speedChangeStep * speedChangeFactor)) && currentRate >= totalRate - changeSpeedLine){
    			__HAL_TIM_SET_PRESCALER(&htim1, currentSpeed - speedChangeStepCount - (speedChangeStepCount * speedChangeFactor));
    		    speedChangeFactor += 1;
    		    return;
    		}

    		 if(currentRate == (changeSpeedLine - (speedChangeStep * speedDownChangeFactor)) && currentRate <= changeSpeedLine){
    			speedChangeFactor -= 1;
    			__HAL_TIM_SET_PRESCALER(&htim1, currentSpeed - (speedChangeStepCount * speedChangeFactor));
    		    speedDownChangeFactor += 1;
    		    return;
    		}

    		return;
    	}

		return;
    }

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
