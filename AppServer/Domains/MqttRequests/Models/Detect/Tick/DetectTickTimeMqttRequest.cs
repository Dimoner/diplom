using AppServer.Domains.MqttRequests.Models.Detect.Base;

namespace AppServer.Domains.MqttRequests.Models.Detect.Tick
{
    /// <summary>
    /// Измерение счет - время
    /// DateTime_4_2_DELAY-{сек, время 1 измерения}_NUM-{кол-во измерений за 1 DELAY} - измерение счетного режима в точке от времени
    /// </summary>
    public class DetectTickTimeMqttRequest : BaseTimeMqttRequest
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