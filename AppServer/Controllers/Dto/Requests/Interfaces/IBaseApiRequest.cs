using AppServer.Domains.MqttRequests.Interfaces;

namespace AppServer.Controllers.Dto.Requests.Interfaces
{
    /// <summary>
    /// Базовый интерфейс всех моделей запроса через api
    /// </summary>
    public interface IBaseApiRequest
    {
        /// <summary>
        /// Формируем запрос для контроллера
        /// </summary>
        /// <returns></returns>
        public IDomainItemMqttRequestBase GetMqttRequest();
    }
}