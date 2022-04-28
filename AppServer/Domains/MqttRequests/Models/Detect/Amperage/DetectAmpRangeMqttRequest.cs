using AppServer.Domains.MqttRequests.Models.Detect.Base;

namespace AppServer.Domains.MqttRequests.Models.Detect.Amperage
{
    /// <summary>
    /// Измерение тока в диапозоне
    /// DateTime_3_1_DIR-{1-часовая/2-против}_WAY-{нм}_STEP-{нм}_COUNT-{нм} - измерение тока на интервале
    /// </summary>
    public class DetectAmpRangeMqttRequest : BaseRangeMqttRequest
    {
        /// <inheritdoc />
        protected override ActionTypeEnum ActionType => ActionTypeEnum.Amperage;
        
        /// <inheritdoc />
        public override string TestCallBack()
        {
            return $"R_{(int)ActionType}_{(int)ActionSubType}*E=-S=1:";
            //return "";
        }
    }
}