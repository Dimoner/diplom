using System;
using System.ComponentModel.DataAnnotations;
using AppServer.Controllers.Attributes;
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
        [PosNumberNoZero]
        [MinInt(180)]
        [MaxInt(1000)]
        public float EndPosition { get; set; }
        
        /// <summary>
        /// Шаг измерения в нм
        /// </summary>
        [Required]
        [JsonProperty("step")]
        [PosNumberNoZero]
        public float Step { get; set; }
        
        /// <summary>
        /// Кол-во измерений в точке
        /// </summary>
        [Required]
        [JsonProperty("count")]
        [PosNumberNoZero]
        public int Count { get; set; }
        
        /// <summary>
        /// Скорость измерения
        /// в тиках
        /// 1 тик = 0,1 мс
        /// </summary>
        [Required]
        [JsonProperty("speed")]
        [PosNumberNoZero]
        public int Speed { get; set; }

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
            return $"Wave, нм    ,{(ActionType == ActionTypeEnum.Tick ? "Cont" : "Amperage")}";
        }
        
        public override string CreateTableMeasureHeader()
        {
            return $"нм            у.е  ";
        }
    }
}