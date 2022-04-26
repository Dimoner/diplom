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
        /// Сколько точек
        /// </summary>
        private int _pointCount;

        /// <summary>
        /// кол-во измерений в точке
        /// </summary>
        private int _count;
        
        /// <summary>
        /// кол-во тиков между точками
        /// </summary>
        private int _frequency { get; set; }
        
        /// <summary>
        /// Парсинг сообщения с фронта
        /// </summary>
        public override void FromDtoApiRequest(StartDetectTimeRequest dto)
        {
            _pointCount = dto.PointCount;
            _count = dto.Count;
            _frequency = (int)(dto.Frequency * 10000);
        }

        protected override Dictionary<string, object> GetMessageValue()
        {
            return new Dictionary<string, object>
            {
                {DomainValueConst.PointCount, _pointCount},
                {DomainValueConst.Count, _count},
                {DomainValueConst.Freq, _frequency},
            };
        }
    }
}