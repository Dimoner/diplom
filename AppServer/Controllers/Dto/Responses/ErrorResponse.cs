using Newtonsoft.Json;

namespace AppServer.Controllers.Dto.Responses
{
    /// <summary>
    /// Модель сообщения с ошибкой
    /// </summary>
    public class ErrorResponse
    {
        /// <summary>
        /// Текст с ошибкой
        /// </summary>
        [JsonProperty("errorText")]
        public string ErrorText { get; set; }
    }
}