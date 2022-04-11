################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (9-2020-q2-update)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../Drivers/UartDto/UartDtoService.c 

C_DEPS += \
./Drivers/UartDto/UartDtoService.d 

OBJS += \
./Drivers/UartDto/UartDtoService.o 


# Each subdirectory must supply rules for building sources it contributes
Drivers/UartDto/%.o: ../Drivers/UartDto/%.c Drivers/UartDto/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m3 -std=gnu11 -g -DDEBUG -DUSE_HAL_DRIVER -DSTM32F103xB -c -I../Core/Inc -I"C:/Users/Dima/Documents/diplom/STM32_ESP_UART-master/Drivers/ESP_UART_Parser" -I../Drivers/STM32F1xx_HAL_Driver/Inc -I../Drivers/STM32F1xx_HAL_Driver/Inc/Legacy -I../Drivers/CMSIS/Device/ST/STM32F1xx/Include -I../Drivers/CMSIS/Include -I"C:/Users/Dima/Documents/diplom/STM32_ESP_UART-master/Drivers/ESP_UART_Parser" -I../Middlewares/Third_Party/FreeRTOS/Source/include -I../Middlewares/Third_Party/FreeRTOS/Source/CMSIS_RTOS_V2 -I../Middlewares/Third_Party/FreeRTOS/Source/portable/GCC/ARM_CM3 -I"C:/Users/Dima/Documents/diplom/STM32_ESP_UART-master/Drivers/Domains" -I"C:/Users/Dima/Documents/diplom/STM32_ESP_UART-master/Drivers/HelpersLogic" -I"C:/Users/Dima/Documents/diplom/STM32_ESP_UART-master/Drivers/UartDto" -O0 -ffunction-sections -fdata-sections -Wall -fstack-usage -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfloat-abi=soft -mthumb -o "$@"

