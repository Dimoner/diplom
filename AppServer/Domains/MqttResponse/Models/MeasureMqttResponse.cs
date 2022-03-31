namespace AppServer.Domains.MqttResponse.Models
{
    /// <summary>
    /// Обработка результата 
    /// </summary>
    public class MeasureMqttResponse
    {
        /// <summary>
        /// Результат по x
        /// </summary>
        public double X { get; set; }

        /// <summary>
        /// Результат по y
        /// </summary>
        public double Y { get; set; }
        
        /// <summary>
        /// Идентификатор измерения
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// Измерение закончилось
        /// </summary>
        public bool IsStop { get; set; }
    }
}