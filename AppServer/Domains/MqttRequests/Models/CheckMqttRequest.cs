using System.Collections.Generic;

namespace AppServer.Domains.MqttRequests.Models
{
    /// <summary>
    /// DateTime_1_0
    /// </summary>
    public class CheckMqttRequest : DomainItemMqttRequestBase<object>
    {
        /// <inheritdoc />
        protected override ActionTypeEnum ActionType => ActionTypeEnum.CheckState;

        /// <inheritdoc />
        protected override SubActionTypeEnum ActionSubType => SubActionTypeEnum.None;

        /// <inheritdoc />
        public override void FromDtoApiRequest(object dto)
        {
        }

        /// <inheritdoc />
        protected override Dictionary<string, object> GetMessageValue()
        {
            return new Dictionary<string, object>();
        }

        public override string TestCallBack()
        {
            return $"_R_{(int)ActionType}_{(int)ActionSubType}*ERR=Странная ошибка -STAT=0";
            //return "";
        }
    }
}