using System;
using System.Threading.Tasks;
using AppServer.Domains.MqttRequests;
using AppServer.Domains.MqttRequests.Models;
using AppServer.Domains.MqttResponse.Models;
using AppServer.Managers.Interfaces;
using AppServer.MqttLogic.Managers.Interfaces;

namespace AppServer.Managers
{
    /// <inheritdoc />
    public class ControlMeasureManager : IControlMeasureManager
    {
        private readonly IMqttManager _mqttManager;

        public ControlMeasureManager(IMqttManager mqttManager)
        {
            _mqttManager = mqttManager;
        }
        
        /// <inheritdoc />
        public async Task<CommandMqttResponse> StartAsync()
            => await SendMqttAsync(new StartMqttRequest());

        /// <inheritdoc />
        public async Task<CommandMqttResponse> PauseAsync()
            => await SendMqttAsync(new PauseMqttRequest());

        /// <inheritdoc />
        public async Task<CommandMqttResponse> StopAsync() 
            => await SendMqttAsync(new StopMqttRequest());
       

        /// <summary>
        /// Базовая логика отправки сообщения
        /// </summary>
        private async Task<CommandMqttResponse> SendMqttAsync(DomainItemMqttRequestBase<object> requestBase)
        {
            var result = await _mqttManager.SendMessageWithResultAsync(requestBase);
            if (!result.IsSuccess)
            {
                throw new Exception(result.ErrorText);
            }
            return result;
        }
    }
}