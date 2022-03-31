namespace AppServer.Domains
{
    /// <summary>
    /// Список констант доменной логики
    /// </summary>
    public class DomainValueConst
    {
        /// <summary>
        /// 1нм - колличество сигналов на двигатель
        /// </summary>
        public const int OneStep = 2000;

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
        /// Время 1 измерения при временном режиме в сек
        /// </summary>
        public const string Delay = "DELAY";
        
        /// <summary>
        ///  Частота измерения в сек
        /// </summary>
        public const string Freq = "FREQ";

        /// <summary>
        /// Кол-во измерений за 1 DELAY
        /// </summary>
        public const string Num = "NUM";
        #endregion
    }
}