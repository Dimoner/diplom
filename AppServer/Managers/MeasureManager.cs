using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AppServer.Controllers.Dto.Requests;
using AppServer.Controllers.Dto.Requests.Base;
using AppServer.Controllers.Dto.Requests.Interfaces;
using AppServer.Domains.MqttRequests.Models;
using AppServer.Domains.MqttResponse.Measure;
using AppServer.Domains.MqttResponse.Models;
using AppServer.History.Interfaces;
using AppServer.Managers.Interfaces;
using AppServer.MqttLogic.Managers.Interfaces;
using AppServer.Settings.Interfaces;

namespace AppServer.Managers
{
    /// <inheritdoc />
    public class MeasureManager : IMeasureManager
    {
        private readonly IMqttManager _mqttManager;
        private readonly IAppSettings _appSettings;
        private readonly IHistoryManager _historyManager;

        public MeasureManager(IMqttManager mqttManager, IAppSettings appSettings, IHistoryManager historyManager)
        {
            _mqttManager = mqttManager;
            _appSettings = appSettings;
            _historyManager = historyManager;
            
            // тестовый блок для измерения тока на периоде
            /*Task.Run(() =>
            {
                while (true)
                {
                    var rnd = new Random();
                    _mqttManager.SendMessageAsync($"_S_{3}-{rnd.Next(700, 10000)}-{rnd.Next(0, 1000)}-100-10К-10п", _appSettings.FromTopic);
                    Task.Delay(1000).Wait();
                }
            });*/
        }
        
        /// <inheritdoc />
        public async Task<CommandMqttResponse> CheckStateAsync()
        {
            var request = new CheckMqttRequest();
            var result = await _mqttManager.SendMessageWithResultAsync(request);
            if (!result.IsSuccess)
            {
                throw new Exception(result.ErrorText);
            }
            return result;
        }

        /// <inheritdoc />
        public async Task<CommandMqttResponse> ChangePositionAsync(ChangePositionRequest dto)
        {
            var request = dto.GetMqttRequest();
            var result = await _mqttManager.SendMessageWithResultAsync(request);
            if (!result.IsSuccess)
            {
                throw new Exception(result.ErrorText);
            }
            return result;
        }

        /// <inheritdoc />
        public async Task<MeasureCommandMqttResponse> StartDetectAsync<T>(T dto) where T : BaseDetectRequest, IBaseApiRequest
        {
            var requestChangePosition = new ChangePositionRequest
            {
                StartPosition = dto.CurrentPosition,
                EndPosition = dto.StartPosition
            };
            await ChangePositionAsync(requestChangePosition);
            
            var fileId = _historyManager.CreateNewFile(dto);
            var request = dto.GetMqttRequest();
            var result = await _mqttManager.SendMessageWithResultAsync(request, fileId.ToString());
            if (!result.IsSuccess)
            {
                throw new Exception(result.ErrorText);
            }
            
            // тестовый блок для измерения тока на периоде
            Task.Run(() =>
            {
                Task.Delay(2000).Wait();
                var rnd = new Random();
                for (double i = 0; i <= 500; i += 1)
                {
                    _mqttManager.SendMessageAsync($"M_{fileId}-{(int)i}-{rnd.Next(10, 100)}:", _appSettings.FromTopic);
                    Task.Delay(10).Wait();
                }
                
                _mqttManager.SendMessageAsync($"M_STOP_{fileId}", _appSettings.FromTopic);
            });
            // тестовый блок 
            
            return new MeasureCommandMqttResponse
            {
                MeasureId = fileId,
                ErrorText = result.ErrorText,
                IsSuccess = result.IsSuccess
            };
        }
    }
}