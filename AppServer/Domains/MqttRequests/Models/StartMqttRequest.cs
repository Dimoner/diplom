using System.Collections.Generic;

namespace AppServer.Domains.MqttRequests.Models
{
    /// <summary>
    /// DateTime_5_0
    /// </summary>
    public class StartMqttRequest : DomainItemMqttRequestBase<object>
    {
        /// <inheritdoc />
        protected override ActionTypeEnum ActionType => ActionTypeEnum.Start;

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
            return $"R_{(int)ActionType}_{(int)ActionSubType}*E=-S=1:";
            //return "";
        }
    }
}