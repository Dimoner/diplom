using System.ComponentModel.DataAnnotations;
using AppServer.Controllers.Dto.Requests.Interfaces;
using AppServer.Domains.MqttRequests.Interfaces;
using AppServer.Domains.MqttRequests.Models;
using Newtonsoft.Json;

namespace AppServer.Controllers.Dto.Requests
{
    /// <summary>
    /// Модель запроса на изменение положение линз
    /// </summary>
    public class ChangePositionRequest : IBaseApiRequest
    {
        /// <summary>
        /// Начальная позиция в нм
        /// </summary>
        [Required]
        [JsonProperty("startPosition")]
        public int StartPosition { get; set; }
        
        /// <summary>
        /// Конечная позиция в нм
        /// </summary>
        [Required]
        [JsonProperty("endPosition")]
        public int EndPosition { get; set; }

        /// <inheritdoc />
        public bool ValidationRequest()
        {
            if (StartPosition == EndPosition)
            {
                return false;
            }
                
            if (EndPosition == 0 && EndPosition == 0)
            {
                return false;
            }

            return true;
        }

        /// <inheritdoc />
        public IDomainItemMqttRequestBase GetMqttRequest()
        {
            var request = new ChangePositionMqttRequest();
            request.FromDtoApiRequest(this);
            return request;
        }
    }
}