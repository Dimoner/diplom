namespace AppServer.Domains
{
    /// <summary>
    /// Типы действий
    /// </summary>
    public enum ActionTypeEnum
    {
        /// <summary>
        /// Проверка состояния
        /// </summary>
        CheckState = 1,
        
        /// <summary>
        /// Смена позиции
        /// </summary>
        ChangePosition = 2,
        
        /// <summary>
        /// Измерение в токовом режиме
        /// </summary>
        Amperage = 3,
        
        /// <summary>
        /// Измерение в сченом режиме
        /// </summary>
        Tick = 4,
        
        /// <summary>
        /// Запуск после паузы
        /// </summary>
        Start = 5,
        
        /// <summary>
        /// Временная остановка измерения
        /// </summary>
        Pause = 6,
        
        /// <summary>
        /// Полная остановка измерения
        /// </summary>
        Stop = 7,
    }
    
    /// <summary>
    /// Способы измерения действия
    /// </summary>
    public enum SubActionTypeEnum
    {
        /// <summary>
        /// никакое
        /// </summary>
        None = 0,
        
        /// <summary>
        /// На диапозоне
        /// </summary>
        Range = 1,
        
        /// <summary>
        /// 1 точка и в ней время определенное
        /// </summary>
        Time = 2,
    }
}