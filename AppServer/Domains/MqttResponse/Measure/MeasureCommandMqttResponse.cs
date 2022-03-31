using AppServer.Domains.MqttResponse.Models;

namespace AppServer.Domains.MqttResponse.Measure
{
    /// <summary>
    /// Ответ на инициализацию процесса измерения
    /// </summary>
    public class MeasureCommandMqttResponse : CommandMqttResponse
    {
        /// <summary>
        /// Идентификатор измерения
        /// </summary>
        public int MeasureId { get; set; }
    }
}