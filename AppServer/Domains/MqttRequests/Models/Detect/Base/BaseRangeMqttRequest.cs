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
        
        /// <summary>
        /// текущее положение с умножением на 100, что бы дроби не делать
        /// Испольхуется для отправки измерения с корректными значениями от stm32
        /// </summary>
        private int _curPosition;

        /// <summary>
        /// скорость вращения при измерении
        /// </summary>
        private int _speed;
        
        public override void FromDtoApiRequest(StartDetectRangeRequest dto)
        {
            _way = (int)(Math.Abs(dto.StartPosition - dto.EndPosition) * 100);
            _dir = dto.StartPosition > dto.EndPosition ? 2 : 1;
            _step = (int)(dto.Step * 100);
            _count = dto.Count;
            _curPosition = (int)(dto.StartPosition * 100);
            _speed = dto.Speed;
        }

        protected override Dictionary<string, object> GetMessageValue()
        {
            return new Dictionary<string, object>
            {
                {DomainValueConst.Dir, _dir},
                {DomainValueConst.Way, _way},
                {DomainValueConst.Step, _step},
                {DomainValueConst.Count, _count},
                {DomainValueConst.Cur, _curPosition},
                {DomainValueConst.Speed, _speed},
            };
        }
        
        /// <summary>
        /// Округление до 2 знаков после запятой
        /// </summary>
        public float RoundUp(float input, int places)
        {
            var multiplier = Math.Pow(10, Convert.ToDouble(places));
            return (float)(Math.Ceiling(input * multiplier) / multiplier);
        }
    }
}