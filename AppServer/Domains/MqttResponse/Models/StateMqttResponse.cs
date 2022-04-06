namespace AppServer.Domains.MqttResponse.Models
{
    /// <summary>
    /// Состояние устрйоства
    /// </summary>
    public class StateMqttResponse
    {
        /// <summary>
        /// Тип измерения сейчас
        /// </summary>
        public ActionTypeEnum ActionType { get; set; }
        
        /// <summary>
        /// Число измерений
        /// </summary>
        public float MeasureCount { get; set; }
        
        /// <summary>
        /// Напряжение
        /// </summary>
        public float Voltage { get; set; }
        
        /// <summary>
        /// позиция текущая
        /// </summary>
        public float Position { get; set; }
        
        /// <summary>
        /// сопротивление текущее на фэу
        /// </summary>
        public string Resistance { get; set; }
        
        /// <summary>
        /// Емкость текущая на фэу
        /// </summary>
        public string Capacitance { get; set; }
    }
}