using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AppServer.Controllers;
using AppServer.Domains;
using AppServer.Domains.MqttRequests.Interfaces;
using AppServer.Domains.MqttResponse;
using AppServer.Domains.MqttResponse.Models;
using AppServer.MqttLogic.Managers.Interfaces;
using AppServer.Settings.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;

namespace AppServer.MqttLogic.Managers
{
    public class MqttManager : IMqttManager
    {
        private readonly IHubContext<MeasureHub> _hubContext;
        
        private static readonly Dictionary<string, Action<CommandMqttResponse>> _handlers = new Dictionary<string, Action<CommandMqttResponse>>();
        
        private ILogger<IMqttManager> _logger;
        private IAppSettings _appSettings;
        private IMqttClient _client;
        private IMqttClientOptions _pushOptions;
        
        public MqttManager(ILogger<IMqttManager> logger, IAppSettings appSettings, IHubContext<MeasureHub> hubContext)
        {
            _hubContext = hubContext;
            Init(logger, appSettings);
        }
        
        /// <inheritdoc />
        public async Task<CommandMqttResponse> SendMessageWithResultAsync(IDomainItemMqttRequestBase request, string measureId = null)
        {
            var requestData = request.CreateRequest(measureId);
            var existCommand = _handlers.GetValueOrDefault(requestData.key);
            if (existCommand != null)
            {
                throw new Exception("Комманда уже существует");
            }
            var awaitAnswer = new TaskCompletionSource<CommandMqttResponse>();
            
            _handlers.Add(requestData.key, mes =>
            {
                awaitAnswer.SetResult(mes);
            });

            await SendMessageAsync(requestData.message, _appSettings.ToTopic);

            await TestCallBackAsync(request.TestCallBack());
            
            return await awaitAnswer.Task.ContinueWith(res =>
            {
                _handlers.Remove(requestData.key);
                return res;
            }).Result;
        }

        /// <inheritdoc />
        public async Task SendMessageAsync(string message, string topic)
        {
            var testMessage = new MqttApplicationMessageBuilder()
                    .WithTopic(topic)
                    .WithPayload(message)
                    .WithExactlyOnceQoS()
                    .WithRetainFlag()
                    .Build();
                
            if (_client.IsConnected)
            {
                _logger.LogInformation($"SendMessageAsync: {message}");
                await _client.PublishAsync(testMessage);
            }
            else
            {
                _logger.LogError("Error with connection"); 
            }
        }

        private void Init(ILogger<IMqttManager> logger, IAppSettings appSettings)
        {
            _logger = logger;
            _appSettings = appSettings;
            var factory = new MqttFactory();
            _client = factory.CreateMqttClient();

            //configure options
            _pushOptions = new MqttClientOptionsBuilder()
                .WithClientId(_appSettings.ClientName)
                .WithTcpServer(_appSettings.ServerUrl, _appSettings.ServerPort)
                .WithCredentials(_appSettings.CredentialLogin, _appSettings.CredentialPassword)
                .WithCleanSession()
                .Build();
            
            _client.UseConnectedHandler(e =>
            {
                _logger.LogInformation("Connected successfully with MQTT Brokers.");
                
                var topicFilter = new TopicFilterBuilder();
                _client.SubscribeAsync(topicFilter.WithTopic(_appSettings.FromTopic).Build()).Wait();
            });
            
            _client.UseDisconnectedHandler(e =>
            {
                _logger.LogInformation("Disconnected from MQTT Brokers.");
            });
            
            CreatePush();
            CreateSubscriber();
            
            _client.ConnectAsync(_pushOptions).Wait();
        }

        /// <summary>
        /// Создаем подписку
        /// </summary>
        private void CreateSubscriber()
        {
            try
            {
                _client.UseApplicationMessageReceivedHandler(e =>
                {
                    _logger.LogInformation("### RECEIVED APPLICATION MESSAGE ###");
                    _logger.LogInformation($"Payload = {Encoding.UTF8.GetString(e.ApplicationMessage.Payload)}");

                    MqttResponseParser.ParseResponse(e.ApplicationMessage.Payload, _handlers, _hubContext);
                });
            }
            catch (Exception e)
            {
                _logger.LogInformation(e.Message);
                throw;
            }
        }

        /// <summary>
        /// Создаем pusher
        /// </summary>
        private void CreatePush()
        {
            try
            {
                _client.UseApplicationMessageReceivedHandler(e =>
                {
                    try
                    {
                        var topic = e.ApplicationMessage.Topic;
                        if (string.IsNullOrWhiteSpace(topic) == false)
                        {
                            var payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
                            _logger.LogInformation($"Topic: {topic}. Message Received: {payload}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogInformation(ex.Message, ex);
                    }
                });
            }
            catch (Exception e)
            {
                _logger.LogInformation(e.Message);
                throw;
            }
        }
        
        /// <summary>
        /// Тестовая логика отправки сообщений
        /// </summary>
        private async Task TestCallBackAsync(string message)
        {
            if (string.IsNullOrWhiteSpace(message))
            {
                return;
            }
            
            await Task.Delay(1000);
            await SendMessageAsync(message, _appSettings.FromTopic);
        }
    }
}