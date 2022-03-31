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
             //await Clients.All.SendAsync("Send", message);
        }
    }
}