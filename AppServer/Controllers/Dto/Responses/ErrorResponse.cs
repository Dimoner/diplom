using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.ModelBinding;
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

        /// <summary>
        /// Список ошибок полей контроллеров
        /// </summary>
        [JsonProperty("errorControllerList")]
        public Dictionary<string, string[]> ErrorControllerList { get; set; }
    }
}