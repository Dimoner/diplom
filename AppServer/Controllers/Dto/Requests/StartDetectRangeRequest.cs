using System;
using System.ComponentModel.DataAnnotations;
using AppServer.Controllers.Dto.Requests.Base;
using AppServer.Controllers.Dto.Requests.Interfaces;
using AppServer.Domains;
using AppServer.Domains.MqttRequests;
using AppServer.Domains.MqttRequests.Interfaces;
using AppServer.Domains.MqttRequests.Models.Detect.Amperage;
using AppServer.Domains.MqttRequests.Models.Detect.Tick;
using Newtonsoft.Json;

namespace AppServer.Controllers.Dto.Requests
{
    /// <summary>
    /// Модель запроса на изменение положение линз
    /// </summary>
    public class StartDetectRangeRequest : BaseDetectRequest, IBaseApiRequest
    {
        /// <summary>
        /// Конечная позиция в нм
        /// </summary>
        [Required]
        [JsonProperty("endPosition")]
        public int EndPosition { get; set; }
        
        /// <summary>
        /// Шаг измерения в нм
        /// </summary>
        [Required]
        [JsonProperty("step")]
        public int Step { get; set; }
        
        /// <summary>
        /// Кол-во измерений в точке
        /// </summary>
        [Required]
        [JsonProperty("count")]
        public int Count { get; set; }

        public bool ValidationRequest()
        {
            return true;
        }

        public IDomainItemMqttRequestBase GetMqttRequest()
        {
            DomainItemMqttRequestBase<StartDetectRangeRequest> model = (ActionType)switch
            {
                ActionTypeEnum.Tick => new DetectTickRangeMqttRequest(),
                ActionTypeEnum.Amperage =>  new DetectAmpRangeMqttRequest(),
                _ => null
            };

            if (model == null)
            {
                throw new Exception();
            }
            
            model.FromDtoApiRequest(this);
            return model;
        }

        public override string CreateTableHeader()
        {
            return $"Wave, нм  | {(ActionType == ActionTypeEnum.Tick ? "Cont" : "Amperage, Am")}";
        }
    }
}