using AppServer.MqttLogic.Managers;
using AppServer.MqttLogic.Managers.Interfaces;
using AppServer.Settings;
using AppServer.Settings.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace AppServer.MqttLogic
{
    /// <summary>
    /// Подключении mqtt протокола
    /// </summary>
    public static class StartUpMqtt
    {
        public static IServiceCollection InitMqtt(this IServiceCollection serviceCollection, IAppSettings appSettings)
        {
            appSettings.StartMqttServer();
            return serviceCollection.AddSingleton<IMqttManager, MqttManager>();
        }
    }
}