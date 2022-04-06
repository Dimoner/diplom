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
        /// Время измерения в сек
        /// 0,1 - частота  > частота
        /// </summary>
        [Required]
        [JsonProperty("delay")]
        [PosNumberNoZero]
        [MinInt(0.9)]
        public float Delay { get; set; }
        
        /// <summary>
        /// Частота измерения в сек
        /// </summary>
        [Required]
        [JsonProperty("frequency")]
        [PosNumberNoZero]
        [MinInt(0.9)]
        public float Frequency { get; set; }
        
        /// <summary>
        /// Кол-во измерений за 1 Delay
        /// </summary>
        [Required]
        [JsonProperty("num")]
        [PosNumberNoZero]
        [MinInt(0)]
        [MaxInt(1024)]
        public int Num { get; set; }

        /// <inheritdoc />
        public bool ValidationRequest()
        {
            return true;
        }

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