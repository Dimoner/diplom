using System;
using System.Threading.Tasks;
using AppServer.Domains.MqttRequests;
using AppServer.Domains.MqttRequests.Models;
using AppServer.Domains.MqttResponse.Models;
using AppServer.Managers.Interfaces;
using AppServer.MqttLogic.Managers.Interfaces;
using AppServer.Settings.Interfaces;

namespace AppServer.Managers
{
    /// <inheritdoc />
    public class ControlMeasureManager : IControlMeasureManager
    {
        private readonly IMqttManager _mqttManager;
        private readonly IAppSettings _appSettings;

        public ControlMeasureManager(IMqttManager mqttManager, IAppSettings appSettings)
        {
            _mqttManager = mqttManager;
            _appSettings = appSettings;
        }
        
        /// <inheritdoc />
        public async Task StartAsync()
            => await SendMqttAsync(new StartMqttRequest());

        /// <inheritdoc />
        public async Task PauseAsync()
            => await SendMqttAsync(new PauseMqttRequest());

        /// <inheritdoc />
        public async Task StopAsync() 
            => await SendMqttAsync(new StopMqttRequest());
       

        /// <summary>
        /// Базовая логика отправки сообщения
        /// </summary>
        private async Task SendMqttAsync(DomainItemMqttRequestBase<object> requestBase)
        {
            await _mqttManager.SendMessageAsync(requestBase.CreateRequest().message, _appSettings.ToTopic);
        }
    }
}