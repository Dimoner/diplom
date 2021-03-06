using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace AppServer.Controllers
{
    /// <summary>
    /// Подписка на получение команд с сервера
    /// </summary>
    public class MeasureHub : Hub
    {
        public async Task Send(string message)
        {
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // если пользователь прерывает содинение во время измерения
            // (закрывает браузер или вкладку, мы отправляем команду на прерывание выполнения измерения)
            await base.OnDisconnectedAsync(exception);
        }
    }
}