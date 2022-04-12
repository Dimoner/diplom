#include "Helpers/RequestResponseParser.h"

/// <summary>
/// 10 милли секунде минимальное время
/// Формируем запрос проверки
/// {int}_{int} - ключ запроса - должен быть отправлен обратно
///
/// 1_0* - проверка состояния
///
/// 2_0*DIR={1-часовая/2-против}-WAY={нм}-ID={int32} - смена позиции
///
/// 3_1*DIR={1-часовая/2-против}-WAY={нм}-STEP={нм}-COUNT={нм}-ID={int32} - измерение тока на интервале
///
/// 3_2*DELAY={сек, время 1 измерения}-NUM={кол-во измерений за 1 DELAY}-ID={int32} - измерение тока в точке от времени
///
/// 4_1*DIR={1-часовая/2-против}-WAY={нм}-STEP={нм}-COUNT={нм}-ID={int32} - измерение счетного режима на интервале
///
/// 4_2*DELAY={сек, время 1 измерения}-NUM={кол-во измерений за 1 DELAY}-ID={int32} - измерение счетного режима в точке от времени
///
/// 5_0* - Запуск после паузы
///
/// 6_0* - Временная остановка измерения
///
/// 7_0* - Полная остановка измерения
/// </summary>

int main() {
    //char months[] = "_2_0*DIR=0-WAY=1111";
    char months[] = "_3_1*DIR=1-WAY=100.1-STEP=100.2-COUNT=13";
    struct TypeStruct actionType = getTypeStruct(months);

    struct ResponseResultActionStruct dto = { actionType , "dimaaaaaaaaa", true};
    char result[200];
    SendResponseResultAction(dto);


    char* payload = getPayload(months);

    if (isCheckState(actionType)){
        return 0;
    }

    if (isChangePosition(actionType)){
        struct ChangePositionStruct changePositionStruct = getChangePositionStruct(payload);
        return 0;
    }

    if (isDetectAmperageRange(actionType)){
        struct DetectAmperageRangeStruct detectAmperageRangeStruct = getDetectAmperageRangeStruct(payload);
        return 0;
    }

    if (isDetectAmperageTime(actionType)){

        return 0;
    }

    if (isDetectTickRange(actionType)){

        return 0;
    }

    if (isDetectTickTime(actionType)){

        return 0;
    }

    if (isContinueMeasure(actionType)){

        return 0;
    }

    if (isPauseMeasure(actionType)){

        return 0;
    }

    if (isStopMeasure(actionType)){

        return 0;
    }
    return 0;
}



