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
    /// Измерение в 1 точке
    /// </summary>
    public class StartDetectTimeRequest : BaseDetectRequest, IBaseApiRequest
    {
        /// <summary>
        /// Кол-во точек, которые надо измерить
        /// </summary>
        [Required]
        [JsonProperty("pointCount")]
        [PosNumberNoZero]
        [MaxInt(65000)]
        public int PointCount { get; set; }
        
        /// <summary>
        /// кол-во тиков между точками
        /// </summary>
        [Required]
        [JsonProperty("frequency")]
        [PosNumberNoZero]
        [MinInt(0)]
        [MaxInt(100)]
        public float Frequency { get; set; }
        
        /// <summary>
        /// Кол-во измерений за 1 Delay
        /// </summary>
        [Required]
        [JsonProperty("count")]
        [PosNumberNoZero]
        [MinInt(0)]
        [MaxInt(1024)]
        public int Count { get; set; }

        /// <inheritdoc />
        public IDomainItemMqttRequestBase GetMqttRequest()
        {
            DomainItemMqttRequestBase<StartDetectTimeRequest> model = (ActionType)switch
            {
                ActionTypeEnum.Tick => new DetectTickTimeMqttRequest(),
                ActionTypeEnum.Amperage =>  new DetectAmpTimeMqttRequest(),
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
            return $"Time, сек   | {(ActionType == ActionTypeEnum.Tick ? "Cont" : "Amperage, Am")}  ";
        }
    }
}