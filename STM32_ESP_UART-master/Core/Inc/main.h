#ifndef __MAIN_H
#define __MAIN_H

#ifdef __cplusplus
extern "C" {
#endif

#include "stm32f1xx_hal.h"

void Error_Handler(void);

#define LED_Pin GPIO_PIN_13
#define LED_GPIO_Port GPIOC
#define LED1_Pin GPIO_PIN_2
#define LED1_GPIO_Port GPIOA
#define Relay_OUT_Pin GPIO_PIN_5
#define Relay_OUT_GPIO_Port GPIOA
#define LED2_Pin GPIO_PIN_6
#define LED2_GPIO_Port GPIOA
#define DIR_Pin GPIO_PIN_0
#define DIR_GPIO_Port GPIOB
#define STEP_Pin GPIO_PIN_1
#define STEP_GPIO_Port GPIOB

#define MOTOR_Port GPIOB

#ifdef __cplusplus
}
#endif

#endif
