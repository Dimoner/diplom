using System.Threading.Tasks;
using AppServer.Domains.MqttRequests.Interfaces;
using AppServer.Domains.MqttResponse.Models;

namespace AppServer.MqttLogic.Managers.Interfaces
{
    /// <summary>
    /// Логика связи с контроллером через брокер
    /// </summary>
    public interface IMqttManager
    {
        /// <summary>
        /// Отправка собщения на контроллер
        /// </summary>
        Task SendMessageAsync(string message, string topic);

        /// <summary>
        /// Отправка сообщения на изменение состояния для stm
        /// С ожиданием ответа
        /// </summary>
        Task<CommandMqttResponse> SendMessageWithResultAsync(IDomainItemMqttRequestBase request, string measureId = null);
    }
}