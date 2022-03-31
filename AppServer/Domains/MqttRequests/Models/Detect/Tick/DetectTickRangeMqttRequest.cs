using AppServer.Domains.MqttRequests.Models.Detect.Base;

namespace AppServer.Domains.MqttRequests.Models.Detect.Tick
{
    /// <summary>
    /// Измерение счет - диапозон
    /// DateTime_4_1_DIR-{1-часовая/2-против}_WAY-{нм}_STEP-{нм}_COUNT-{нм} - измерение счетного режима на интервале
    /// </summary>
    public class DetectTickRangeMqttRequest : BaseRangeMqttRequest
    {
        /// <inheritdoc />
        protected override ActionTypeEnum ActionType => ActionTypeEnum.Tick;

        /// <inheritdoc />
        public override string TestCallBack()
        {
            return $"_R_{(int)ActionType}_{(int)ActionSubType}*ERR=-STAT=1";
            //return "";
        }
    }
}