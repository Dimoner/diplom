using AppServer.Domains.MqttRequests.Models.Detect.Base;

namespace AppServer.Domains.MqttRequests.Models.Detect.Amperage
{
    /// <summary>
    /// Измерение тока от времени в точки
    /// DateTime_3_2_DELAY-{сек, время 1 измерения}_NUM-{кол-во измерений за 1 DELAY} - измерение тока в точке от времени
    /// </summary>
    public class DetectAmpTimeMqttRequest : BaseTimeMqttRequest
    {
        /// <inheritdoc />
        protected override ActionTypeEnum ActionType => ActionTypeEnum.Amperage;
        
        /// <inheritdoc />
        public override string TestCallBack()
        {
            return $"_R_{(int)ActionType}_{(int)ActionSubType}*ERR=-STAT=1";
            //return "";
        }
    }
}