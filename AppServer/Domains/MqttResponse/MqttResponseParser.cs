using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AppServer.Controllers;
using AppServer.Domains.MqttResponse.Models;
using AppServer.History;
using Microsoft.AspNetCore.SignalR;

namespace AppServer.Domains.MqttResponse
{
    /// <summary>
    /// Парсинг ответов от сервера
    /// </summary>
    public static class MqttResponseParser
    {
        /// <summary>
        /// Парсинг ответа от брокера
        /// </summary>
        public static void ParseResponse(byte[] payloadByteList, Dictionary<string, Action<CommandMqttResponse>> handlers, IHubContext<MeasureHub> hubContext, IHubContext<StateHub> stateHub)
        {
            // DateTime_Value.......
            var payload = Encoding.UTF8.GetString(payloadByteList);
            // Value.......
            payload = payload.Remove(0, payload.IndexOf("_", StringComparison.Ordinal) + 1);
            
            // результат измерения
            // M_0-0-0 ||  M_STOP_0
            if (payload.StartsWith("M_"))
            {
                ParseMeasureResponse(payload, hubContext);
                return;
            }

            // результат выполнения операции
            // R_0_0*ERR={}_STAT={}
            if (payload.StartsWith("R_"))
            {
                ParseCommandResponse(payload, handlers);
                return;
            }
            
            // результат поулчение состояния устройства
            // S_{режим (3-ток/4-счет)}-{число тока или счета(число условных едениц)}-{напряжение на фэу(B)}-положение(нм)-{сопротивление}-{емкость}
            if (payload.StartsWith("S_"))
            {
                ParseStateCommandResponse(payload, stateHub);
                return;
            }
            
            throw new Exception("Обработчик не найден");
        }

        private static void ParseStateCommandResponse(string payload, IHubContext<StateHub> stateHub)
        {
            // {режим (3-ток/4-счет)}-{число тока или счета(число условных едениц)}-{напряжение на фэу(B)}-{положение(нм)}-{сопротивление}-{емкость}}
            payload = payload.Remove(0, payload.IndexOf("_", StringComparison.Ordinal) + 1);
            
            // [
            //     режим (3-ток/4-счет),
            //     число тока или счета(число условных едениц),
            //     напряжение на фэу(B),
            //     положение(нм),
            //     сопротивление,
            //     емкость
            // ]
            var data = payload.Split("-").ToArray();
            var response = new StateMqttResponse
            {
                ActionType = Convert.ToInt32(data[0]) == Convert.ToInt32(ActionTypeEnum.Amperage) ? ActionTypeEnum.Amperage : ActionTypeEnum.Tick,
                MeasureCount = Convert.ToInt32(data[1]),
                Voltage = Convert.ToInt32(data[2]),
                Position = Convert.ToInt32(data[3]),
                Resistance = data[4],
                Capacitance = data[5],
            };
            
            Task.Run(() => stateHub.Clients.All.SendAsync("state", response)).Wait();
        }

        /// <summary>
        /// Парсим запрос на команду
        /// </summary>
        /// <param name="payload">R_0_0*ERR={}-STAT={}</param>
        /// <param name="handlers">ожидающие обработчики</param>
        private static void ParseCommandResponse(string payload, Dictionary<string, Action<CommandMqttResponse>> handlers)
        {
            // _0_0*ERR={}-STAT={}
            payload = payload.Remove(0, payload.IndexOf("R", StringComparison.Ordinal) + 1);
            
            // ["_0_0", "ERR={}-STAT={}"]
            var values = payload.Split('*');
            // "_00_00"
            var key = values[0];
            var currentKeyFilterResult = key
                .Split('_')
                .Where(value => value != "")
                .Select(charValue => Convert.ToInt32(charValue))
                .ToArray();
            // "_0_0"
            key = $"_{currentKeyFilterResult[0]}_{currentKeyFilterResult[1]}";
            
            // [["ERR", "{}"], ["STAT", "{}"]]
            var payloadResult = values[1].Split('-').Select(value => value.Split("=")).ToArray();

            var commandMqttResponse = new CommandMqttResponse();
            
            foreach (var result in payloadResult)
            {
                // ["ERR", "{}"], ["STAT", "{}"]
                if (result[0] == DomainValueConst.ErrorText)
                {
                    commandMqttResponse.ErrorText = result[1];
                }

                if (result[0] == DomainValueConst.IsSuccess)
                {
                    commandMqttResponse.IsSuccess = result[1] == "1";
                }
            }
            
            foreach (var value in handlers)
            {
                if (key == value.Key)
                {
                    value.Value.Invoke(commandMqttResponse);
                    return;
                }
            }
        }

        /// <summary>
        /// Парсис сообщение с измерением
        /// </summary>
        /// <param name="payload">
        /// M_STOP_0, где
        /// [0] - идентификатор файла
        /// --------------------------------
        /// M_0-0-0, где
        /// [0] - идентификатор файла
        /// [1] - X
        /// [2] - Y
        /// </param>
        /// <param name="hubContext">брокер веб сокета</param>
        private static void ParseMeasureResponse(string payload, IHubContext<MeasureHub> hubContext)
        {
            var response = GetMeasureResponseHandler(payload);
            HistoryManager.WireInFile(response);
            Task.Run(() => hubContext.Clients.All.SendAsync(response.Id.ToString(), response)).Wait();
        }

        /// <summary>
        /// Парсис сообщение с измерением
        /// </summary>
        private static MeasureMqttResponse GetMeasureResponseHandler(string payload)
        {
            if (payload.StartsWith("M_STOP"))
            {
                // [M, STOP, 0]
                var responseItems = payload.Split("_");
                var id = Convert.ToInt32(responseItems[2]);
                return new MeasureMqttResponse
                {
                    IsStop = true,
                    Id = id
                };
            }
            
            // 0-0-0
            payload = payload.Remove(0, payload.IndexOf("_", StringComparison.Ordinal) + 1);
            // [0, 0, 0]
            var xAndYList = payload.Split("-").ToArray();
            var measureResponse = new MeasureMqttResponse()
            {
                IsStop = false,
                Id = Convert.ToInt32(xAndYList[0]),
                X = Convert.ToDouble(xAndYList[1]), 
                Y = Convert.ToDouble(xAndYList[2])
            };

            return measureResponse;
        }
    }
}