using AppServer.Domains.MqttResponse.Models;
using Newtonsoft.Json;

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
        [JsonProperty("measureId")]
        public int MeasureId { get; set; }
    }
}