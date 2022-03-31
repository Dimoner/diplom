using Newtonsoft.Json;

namespace AppServer.Controllers.Dto.Requests.Filters
{
    /// <summary>
    /// Фильтр получения истории измерений
    /// </summary>
    public class GetFileHistoryFilterRequest
    {
        /// <summary>
        /// Начальная позиция
        /// </summary>
        [JsonProperty("startRow")]
        public int StartRow { get; set; } = 0;

        /// <summary>
        /// Конечная позиция
        /// </summary>
        [JsonProperty("endRow")]
        public int EndRow { get; set; } = 30;
        
        /// <summary>
        /// Имя файла для истории
        /// </summary>
        [JsonProperty("name")]
        public string Name { get; set; }
    }
}