using System;
using System.Threading.Tasks;
using AppServer.Managers.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace AppServer.Controllers
{
    /// <summary>
    /// Подписка на получение команд с сервера
    /// </summary>
    public class MeasureHub : Hub
    {
        private readonly IControlMeasureManager _controlMeasureManager;

        public MeasureHub(IControlMeasureManager controlMeasureManager)
        {
            _controlMeasureManager = controlMeasureManager;
        }
        
        public async Task Send(string message)
        {
             //await Clients.All.SendAsync("Send", message);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // если пользователь прерывает содинение во время измерения
            // (закрывает браузер или вкладку, мы отправляем команду на прерывание выполнения измерения)
            await _controlMeasureManager.StopAsync();
            await base.OnDisconnectedAsync(exception);
        }
    }
}