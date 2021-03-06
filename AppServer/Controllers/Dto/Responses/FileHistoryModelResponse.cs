using System;
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
        public DateTime CreationDateTime { get; set; }
        
        /// <summary>
        /// Тип измерения
        /// </summary>
        [JsonProperty("measureType")]
        public string MeasureType { get; set; }
        
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