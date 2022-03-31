using Newtonsoft.Json;

namespace AppServer.Controllers.Dto.Responses
{
    /// <summary>
    /// Модель отдачи информации по истории платежа
    /// </summary>
    public class FileHistoryModelResponse
    {
        /// <summary>
        /// Идентификатор файла
        /// </summary>
        [JsonProperty("id")]
        public int Id { get; set; }
        
        /// <summary>
        /// Вермя создание файла
        /// </summary>
        [JsonProperty("creationDateTime")]
        public string CreationDateTime { get; set; }
        
        /// <summary>
        /// Описание файла
        /// </summary>
        [JsonProperty("description")]
        public string Description { get; set; }
        
        /// <summary>
        /// Название измерения
        /// </summary>
        [JsonProperty("measureName")]
        public string MeasureName { get; set; }
    }
}