﻿using System;
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
                    Console.WriteLine("WithApplicationMessageInterceptor block merging data");
                    var newData = Encoding.UTF8.GetBytes(DateTime.Now.ToString("O"));
                    var oldData = context.ApplicationMessage.Payload;
                    var mergedData = newData.Concat(oldData).ToArray();
                    context.ApplicationMessage.Payload = mergedData;
                })
                .WithConnectionBacklog(100)
                .WithDefaultEndpointPort(appSettings.ServerPort);


            //start server
            var mqttServer = new MqttFactory().CreateMqttServer();
            mqttServer.StartAsync(optionsBuilder.Build()).Wait();
            Console.WriteLine($"Broker is Running: Host: {mqttServer.Options.DefaultEndpointOptions.BoundInterNetworkAddress} Port: {mqttServer.Options.DefaultEndpointOptions.Port}");
        }
    }
}