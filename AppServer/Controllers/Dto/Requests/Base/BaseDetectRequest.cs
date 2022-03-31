using System.ComponentModel.DataAnnotations;
using AppServer.Domains;
using Newtonsoft.Json;

namespace AppServer.Controllers.Dto.Requests.Base
{
    /// <summary>
    /// Базовая модель для запуска измерений
    /// </summary>
    public abstract class BaseDetectRequest
    {
        /// <summary>
        /// Ток/счет
        /// </summary>
        [Required]
        [JsonProperty("actionType")]
        public ActionTypeEnum ActionType { get; set; }
        
        /// <summary>
        /// Текущее положение
        /// </summary>
        [Required]
        [JsonProperty("currentPosition")]
        public int CurrentPosition { get; set; }
        
        /// <summary>
        /// Начальная позиция в нм
        /// </summary>
        [Required]
        [JsonProperty("startPosition")]
        public int StartPosition { get; set; }
        
        /// <summary>
        /// предварительное описание, которое надо добавить в новый файл
        /// </summary>
        [JsonProperty("description")]
        public string Description { get; set; }
        
        /// <summary>
        /// Название измерения
        /// </summary>
        [JsonProperty("measureName")]
        public string MeasureName { get; set; }

        /// <summary>
        /// Формируем заголовок таблицы
        /// </summary>
        /// <returns></returns>
        public abstract string CreateTableHeader();
    }
}