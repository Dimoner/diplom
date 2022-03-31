using System;
using System.Collections.Generic;
using AppServer.Controllers.Dto.Requests;

namespace AppServer.Domains.MqttRequests.Models.Detect.Base
{
    public class BaseRangeMqttRequest : DomainItemMqttRequestBase<StartDetectRangeRequest>
    {
        protected override ActionTypeEnum ActionType { get; }
        /// <inheritdoc />
        protected override SubActionTypeEnum ActionSubType => SubActionTypeEnum.Range;
        
        /// <summary>
        /// направление
        /// </summary>
        private int _dir;

        /// <summary>
        /// путь
        /// </summary>
        private int _way;

        /// <summary>
        /// шаг для измерения
        /// </summary>
        private int _step;

        /// <summary>
        /// кол-во измерений в точке
        /// </summary>
        private int _count;
        
        public override void FromDtoApiRequest(StartDetectRangeRequest dto)
        {
            _way = Math.Abs(dto.StartPosition - dto.EndPosition);
            _dir = dto.StartPosition > dto.EndPosition ? 2 : 1;
            _step = dto.Step;
            _count = dto.Count;
        }

        protected override Dictionary<string, object> GetMessageValue()
        {
            return new Dictionary<string, object>
            {
                {DomainValueConst.Dir, _dir},
                {DomainValueConst.Way, _way},
                {DomainValueConst.Step, _step},
                {DomainValueConst.Count, _count},
            };
        }
    }
}