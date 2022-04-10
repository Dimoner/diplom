################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (9-2020-q2-update)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../Drivers/ESP_UART_Parser/CParser.c 

C_DEPS += \
./Drivers/ESP_UART_Parser/CParser.d 

OBJS += \
./Drivers/ESP_UART_Parser/CParser.o 


# Each subdirectory must supply rules for building sources it contributes
Drivers/ESP_UART_Parser/%.o: ../Drivers/ESP_UART_Parser/%.c Drivers/ESP_UART_Parser/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m3 -std=gnu11 -g -DDEBUG -DUSE_HAL_DRIVER -DSTM32F103xB -c -I../Core/Inc -I"C:/STM32/STM32_Projects/ESP-01_UART/Drivers/ESP_UART_Parser" -I../Drivers/STM32F1xx_HAL_Driver/Inc -I../Drivers/STM32F1xx_HAL_Driver/Inc/Legacy -I../Drivers/CMSIS/Device/ST/STM32F1xx/Include -I../Drivers/CMSIS/Include -I"C:/STM32/STM32_Projects/ESP-01_UART/Drivers/ESP_UART_Parser" -I../Middlewares/Third_Party/FreeRTOS/Source/include -I../Middlewares/Third_Party/FreeRTOS/Source/CMSIS_RTOS_V2 -I../Middlewares/Third_Party/FreeRTOS/Source/portable/GCC/ARM_CM3 -O0 -ffunction-sections -fdata-sections -Wall -fstack-usage -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfloat-abi=soft -mthumb -o "$@"

