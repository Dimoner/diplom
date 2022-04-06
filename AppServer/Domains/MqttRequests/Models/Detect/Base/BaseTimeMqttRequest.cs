using System.Collections.Generic;
using AppServer.Controllers.Dto.Requests;

namespace AppServer.Domains.MqttRequests.Models.Detect.Base
{
    /// <summary>
    /// Базовая модель измерения относительно времени
    /// </summary>
    public class BaseTimeMqttRequest : DomainItemMqttRequestBase<StartDetectTimeRequest>
    {
        /// <inheritdoc />
        protected override ActionTypeEnum ActionType { get; }

        /// <inheritdoc />
        protected override SubActionTypeEnum ActionSubType => SubActionTypeEnum.Time;

        /// <summary>
        /// Время измерения в сек
        /// </summary>
        private float _delay;

        /// <summary>
        /// Кол-во измерений за 1 _delay
        /// </summary>
        private int _num;
        
        /// <summary>
        /// Частота измерения в сек
        /// </summary>
        private float _frequency { get; set; }
        
        /// <summary>
        /// Парсинг сообщения с фронта
        /// </summary>
        public override void FromDtoApiRequest(StartDetectTimeRequest dto)
        {
            _num = dto.Num;
            _delay = dto.Delay;
            _frequency = dto.Frequency;
        }

        protected override Dictionary<string, object> GetMessageValue()
        {
            return new Dictionary<string, object>
            {
                {DomainValueConst.Delay, _delay},
                {DomainValueConst.Num, _num},
                {DomainValueConst.Freq, _frequency},
            };
        }
    }
}