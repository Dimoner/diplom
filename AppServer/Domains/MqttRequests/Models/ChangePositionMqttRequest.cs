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
        /// 1 - увеличение нм/0 - уменьшение нм
        /// </summary>
        private bool _dir;

        /// <summary>
        /// Кол-во нм которые надо пройти
        /// </summary>
        private float _way;

        public override void FromDtoApiRequest(ChangePositionRequest dto)
        {
            _way = Math.Abs(dto.StartPosition - dto.EndPosition);
            _dir = dto.StartPosition < dto.EndPosition;
        }

        /// <inheritdoc />
        protected override Dictionary<string, object> GetMessageValue()
        {
            return new Dictionary<string, object>
            {
                {DomainValueConst.Dir, _dir ? "1" : "0"},
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