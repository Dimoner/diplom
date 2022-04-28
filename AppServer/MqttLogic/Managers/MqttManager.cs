using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AppServer.Controllers;
using AppServer.Domains;
using AppServer.Domains.MqttRequests.Interfaces;
using AppServer.Domains.MqttRequests.Models;
using AppServer.Domains.MqttResponse;
using AppServer.Domains.MqttResponse.Models;
using AppServer.MqttLogic.Managers.Interfaces;
using AppServer.Settings.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;

namespace AppServer.MqttLogic.Managers
{
    public class MqttManager : IMqttManager
    {
        private static readonly Dictionary<string, Action<CommandMqttResponse>> _handlers = new ();
        
        private static ILogger<IMqttManager> _logger;
        
        private static IAppSettings _appSettings;
        
        private static IMqttClient _client;
        
        /// <summary>
        /// Инициализация подписки на брокер
        /// </summary>
        /// <param name="serviceProvider"></param>
         public static void Init(IServiceProvider serviceProvider)
        {
            _logger = serviceProvider.GetRequiredService<ILogger<IMqttManager>>();
            _appSettings = serviceProvider.GetRequiredService<IAppSettings>();
            
            var hubMeasure = serviceProvider.GetRequiredService<IHubContext<MeasureHub>>();
            var hubState = serviceProvider.GetRequiredService<IHubContext<StateHub>>();
            
            var factory = new MqttFactory();
            _client = factory.CreateMqttClient();

            //configure options
            var pushOptions = new MqttClientOptionsBuilder()
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
                Init(serviceProvider);
            });
            
             try
            {
                _client.UseApplicationMessageReceivedHandler(e =>
                {
                    try
                    {
                        var topic = e.ApplicationMessage.Topic;
                        _logger.LogInformation(topic);
                        if (!string.IsNullOrWhiteSpace(topic))
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

            try
            {
                _client.UseApplicationMessageReceivedHandler(e =>
                {
                    _logger.LogInformation("### RECEIVED APPLICATION MESSAGE ###");
                    var payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
                    _logger.LogInformation($"Payload = {payload}");

                    MqttResponseParser.ParseResponse(payload, _handlers, hubMeasure, hubState, _logger);
                });
            }
            catch (Exception e)
            {
                _logger.LogInformation(e.Message);
                throw;
            }
            
            _client.ConnectAsync(pushOptions).Wait();
        }
        
        /// <inheritdoc />
        public async Task<CommandMqttResponse> SendMessageWithResultAsync(IDomainItemMqttRequestBase request, string measureId = null)
        {
            var requestData = request.CreateRequest(measureId);
            var existCommand = _handlers.GetValueOrDefault(requestData.key);
            if (existCommand != null)
            {
                // если команда уже существует, удаляем старую, отправляем запрос на удаление в контроллере 
                // немного ждем на всякий случа и отправляем новую
                await SendMessageAsync(new StopMqttRequest().CreateRequest().message, _appSettings.ToTopic);
                _handlers.Remove(requestData.key);
                await Task.Delay(1000);
            }
            var awaitAnswer = new TaskCompletionSource<CommandMqttResponse>();
            
            _handlers.Add(requestData.key, mes =>
            {
                awaitAnswer.SetResult(mes);
            });

            await SendMessageAsync(requestData.message, _appSettings.ToTopic);

            //await TestCallBackAsync(request.TestCallBack());
            
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