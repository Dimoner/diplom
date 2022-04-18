namespace AppServer.Domains
{
    /// <summary>
    /// Список констант доменной логики
    /// </summary>
    public class DomainValueConst
    {
        #region ResponseCommand

        /// <summary>
        /// Тест с ошибкой
        /// </summary>
        public const string ErrorText = "ERR";

        /// <summary>
        /// Результат выполнения команды
        /// </summary>
        public const string IsSuccess = "STAT";
        
        #endregion

        #region RequestCommand
        /// <summary>
        /// Идентификатор измерения
        /// </summary>
        public const string Id = "ID";
        
        /// <summary>
        /// Направление вращения
        /// </summary>
        public const string Dir = "DIR";

        /// <summary>
        /// 1 шаг при прохождении WAY
        /// </summary>
        public const string Step = "STEP";
        
        /// <summary>
        /// путь в нм который надо пройти
        /// </summary>
        public const string Way = "WAY";

        /// <summary>
        /// Кол-во измерений в точке
        /// </summary>
        public const string Count = "COUNT";

        /// <summary>
        /// Сколько точек надо измерить в счетном режиме
        /// </summary>
        public const string PointCount = "POINT";
        
        /// <summary>
        ///  Частота измерения в сек
        /// </summary>
        public const string Freq = "FREQ";

        /// <summary>
        /// текущее положение с умножением на 100, что бы дроби не делать
        /// Испольхуется для отправки измерения с корректными значениями от stm32
        /// </summary>
        public const string Cur = "CUR";

        /// <summary>
        /// скорость вращения во время режима измерения на промежутке
        /// </summary>
        public const string Speed = "SPE";

        #endregion
    }
}