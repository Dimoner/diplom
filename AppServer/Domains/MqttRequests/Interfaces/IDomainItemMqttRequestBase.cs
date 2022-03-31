namespace AppServer.Domains.MqttRequests.Interfaces
{
    /// <summary>
    /// Формируем запрос для сервера
    /// </summary>
    public interface IDomainItemMqttRequestBase
    {
        /// <summary>
        /// Формирует запрос на сервер с сообщением для stm
        /// </summary>
        /// <returns></returns>
        public (string key, string message) CreateRequest(string measureId = null);

        public string TestCallBack();
    }
}