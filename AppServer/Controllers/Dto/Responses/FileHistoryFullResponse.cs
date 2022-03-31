using Newtonsoft.Json;

namespace AppServer.Controllers.Dto.Responses
{
    /// <summary>
    /// Полный айтем истории
    /// </summary>
    public class FileHistoryFullResponse
    {
        /// <summary>
        /// Сколько всего страниц
        /// </summary>
        [JsonProperty("total")]
        public int Total { get; set; }
        
        /// <summary>
        /// Элементы данной страницы
        /// </summary>
        [JsonProperty("history")]
        public FileHistoryModelResponse[] History { get; set; }
    }
}