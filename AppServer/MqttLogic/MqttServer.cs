using System;
using System.Linq;
using System.Text;
using AppServer.Settings;
using AppServer.Settings.Interfaces;
using MQTTnet;
using MQTTnet.Protocol;
using MQTTnet.Server;

namespace AppServer.MqttLogic
{
    public static class MqttServer
    {
        public static IMqttServer Server;
        public static void StartMqttServer(this IAppSettings appSettings)
        {
              var optionsBuilder = new MqttServerOptionsBuilder()
                .WithConnectionValidator(c =>
                {
                    try
                    {
                        Console.Write($"{nameof(c.Endpoint)}={c.Endpoint},{nameof(c.Username)}={c.Username},{nameof(c.Password)}={c.Password},{nameof(c.Endpoint)}={c.Endpoint}");
                        Console.WriteLine($"{c.ClientId} connection validator for c.Endpoint: {c.Endpoint}");
                        c.ReasonCode = MqttConnectReasonCode.Success;
                    }
                    catch (Exception e)
                    {
                        Console.Write("Errror");
                    }
                })
                .WithApplicationMessageInterceptor(context =>
                {
                    Console.WriteLine("Get message with: \n");
                    Console.WriteLine("Topic:" + context.ApplicationMessage.Topic);
                    Console.WriteLine("Data:" + context.ApplicationMessage.Topic);
                })
                .WithConnectionBacklog(100)
                .WithDefaultEndpointPort(appSettings.ServerPort);


            //start server
            Server = new MqttFactory().CreateMqttServer();
            Server.StartAsync(optionsBuilder.Build()).Wait();
            Console.WriteLine($"Broker is Running: Host: {Server.Options.DefaultEndpointOptions.BoundInterNetworkAddress} Port: {Server.Options.DefaultEndpointOptions.Port}");
        }
    }
}