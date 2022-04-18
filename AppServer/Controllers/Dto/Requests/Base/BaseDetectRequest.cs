using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using AppServer.Controllers.Attributes;
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
        [PosNumberNoZero]
        [Range(180, 1000)]
        public float CurrentPosition { get; set; }
        
        /// <summary>
        /// Начальная позиция в нм
        /// </summary>
        [Required]
        [JsonProperty("startPosition")]
        [PosNumberNoZero]
        [MinInt(180)]
        [MaxInt(1000)]
        public float StartPosition { get; set; }
        
        /// <summary>
        /// предварительное описание, которое надо добавить в новый файл
        /// </summary>
        [JsonProperty("description")]
        public string Description { get; set; }
        
        /// <summary>
        /// Название измерения
        /// </summary>
        [JsonProperty("measureName")]
        [Required]
        public string MeasureName { get; set; }

        /// <summary>
        /// Формируем заголовок таблицы
        /// 12 символов 1 ячейка
        /// </summary>
        /// <returns></returns>
        public abstract string CreateTableHeader();
        
        /// <summary>
        /// Преобразуем под размер ячейки блоки
        /// </summary>
        public static string GetMeasureCurrentFormat(double measureInt)
        {
            var valueString = measureInt.ToString(CultureInfo.InvariantCulture);
            var concat = string.Concat(valueString, string.Concat(Enumerable.Repeat(" ", 12 - valueString.Length)));
            return concat;
        }
    }
}