using System.ComponentModel.DataAnnotations;
using AppServer.Controllers.Attributes;
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
        [PosNumberNoZero]
        [MinInt(180)]
        [MaxInt(1000)]
        public float StartPosition { get; set; }
        
        /// <summary>
        /// Конечная позиция в нм
        /// </summary>
        [Required]
        [JsonProperty("endPosition")]
        [PosNumberNoZero]
        [MinInt(180)]
        [MaxInt(1000)]
        public float EndPosition { get; set; }

        /// <inheritdoc />
        public IDomainItemMqttRequestBase GetMqttRequest()
        {
            var request = new ChangePositionMqttRequest();
            request.FromDtoApiRequest(this);
            return request;
        }
    }
}