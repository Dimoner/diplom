using System.Collections.Generic;

namespace AppServer.Domains.MqttRequests.Models
{
    /// <summary>
    /// DateTime_6_0
    /// </summary>
    public class StopMqttRequest : DomainItemMqttRequestBase<object>
    {
        /// <inheritdoc />
        protected override ActionTypeEnum ActionType => ActionTypeEnum.Stop;

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
            return $"_R_{(int)ActionType}_{(int)ActionSubType}*ERR=-STAT=1";
            //return "";
        }
    }
}