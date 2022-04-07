#include <stdbool.h>
#include <stdint.h>

/// тип команды
struct TypeStruct {
    // Тип:
    // 1 - Проверка состояния
    // 2 - Смена позиции
    // 3 - Измерение в токовом режиме
    // 4 - Измерение в сченом режиме
    // 5 - Запуск после паузы
    // 6 - Временная остановка измерения
    // 7 - Полная остановка измерения
    char type[2];

    // Способы измерения действия:
    // 0 - никакое
    // 1 - На диапозоне
    // 2 - 1 точка и в ней время определенное
    char subType[2];
};

/// проверка состояния
bool isCheckState(struct TypeStruct dto);
/// продолжит ьпосле паузы
bool isContinueMeasure(struct TypeStruct dto);
/// пауза
bool isPauseMeasure(struct TypeStruct dto);
/// сбросить все
bool isStopMeasure(struct TypeStruct dto);

/// смена позиции
bool isChangePosition(struct TypeStruct dto);
struct ChangePositionStruct {
    /// направление
    bool dir;
    /// сколько нм надо преодалеть
    float way;
};

/// измерение тока на интервале
bool isDetectAmperageRange(struct TypeStruct dto);
struct DetectAmperageRangeStruct {
    /// направление
    bool dir;
    /// сколько нм надо преодалеть
    float way;
    /// шаг в нм
    float step;
    /// кол-во измерений
    uint16_t count;
};

/// измерение тока в точке от времени
bool isDetectAmperageTime(struct TypeStruct dto);
struct DetectAmperageTimeStruct {
    /// сек, время 1 измерения
    float delay;
    /// кол-во измерений за 1 DELAY
    int16_t num;
    /// Частота измерения в сек
    float freq;
};

/// измерение тока в точке от времени
bool isDetectTickRange(struct TypeStruct dto);
struct DetectTickRangeDetectTickRangeStruct {
    /// направление
    bool dir;
    /// сколько нм надо преодалеть
    float way;
    /// шаг в нм
    float step;
    /// кол-во измерений
    uint16_t count;
};

/// измерение счетного режима в точке от времени
bool isDetectTickTime(struct TypeStruct dto);
struct DetectTickTimeStruct {
    /// сек, время 1 измерения
    float delay;
    /// кол-во измерений за 1 DELAY
    int16_t num;
    /// Частота измерения в сек
    float freq;
};

