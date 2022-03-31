using System;
using System.Collections.Generic;
using AppServer.Controllers.Dto.Requests;

namespace AppServer.Domains.MqttRequests.Models
{
    /// <summary>
    /// Смена позиции
    /// DateTime_1_0_DIR-{1-часовая/2-против}_WAY-{нм} - смена позиции
    /// </summary>
    public class ChangePositionMqttRequest : DomainItemMqttRequestBase<ChangePositionRequest>
    {
        /// <inheritdoc />
        protected override ActionTypeEnum ActionType => ActionTypeEnum.ChangePosition;

        /// <inheritdoc />
        protected override SubActionTypeEnum ActionSubType => SubActionTypeEnum.None;

        /// <summary>
        /// По часовой или против вращение
        ///  2 - против часовой, 1 - по часовой
        /// </summary>
        private int _dir;

        /// <summary>
        /// Кол-во нм которые надо пройти
        /// </summary>
        private int _way;

        public override void FromDtoApiRequest(ChangePositionRequest dto)
        {
            _way = Math.Abs(dto.StartPosition - dto.EndPosition);
            _dir = dto.StartPosition > dto.EndPosition ? 2 : 1;
        }

        /// <inheritdoc />
        protected override Dictionary<string, object> GetMessageValue()
        {
            return new Dictionary<string, object>
            {
                {DomainValueConst.Dir, _dir},
                {DomainValueConst.Way, _way},
            };
        }

        /// <inheritdoc />
        public override string TestCallBack()
        {
            return $"_R_{(int)ActionType}_{(int)ActionSubType}*ERR=-STAT=1";
            //return "";
        }
    }
}