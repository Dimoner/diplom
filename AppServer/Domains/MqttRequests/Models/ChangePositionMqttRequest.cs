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
        private int _way;

        /// <summary>
        /// идентификатор операции
        /// пока не используется для этой команды
        /// </summary>
        private int _id;

        public override void FromDtoApiRequest(ChangePositionRequest dto)
        {
            _way = (int)(Math.Abs(dto.StartPosition - dto.EndPosition) * 100);
            _dir = dto.StartPosition < dto.EndPosition;
            _id = 0;
        }

        /// <inheritdoc />
        protected override Dictionary<string, object> GetMessageValue()
        {
            return new Dictionary<string, object>
            {
                {DomainValueConst.Dir, _dir ? "1" : "0"},
                {DomainValueConst.Way, _way},
                {DomainValueConst.Id, _id},
            };
        }

        /// <inheritdoc />
        public override string TestCallBack()
        {
            return $"R_{(int)ActionType}_{(int)ActionSubType}*E=-S=1:";
            //return "";
        }
    }
}