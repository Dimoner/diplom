﻿using System;
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
            if (!dto.ValidationRequest())
            {
                return new CommandMqttResponse(true);
            }
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
                var rnd = new Random();
                for (int i = 0; i <= 20; i++)
                {
                    _mqttManager.SendMessageAsync($"_M_{fileId}-{rnd.Next(0, 100)}-{rnd.Next(0, 100)}", _appSettings.FromTopic);
                    Task.Delay(10).Wait();
                }
                
                _mqttManager.SendMessageAsync($"_M_STOP_{fileId}", _appSettings.FromTopic);
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