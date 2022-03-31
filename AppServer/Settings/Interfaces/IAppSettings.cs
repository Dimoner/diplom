
namespace AppServer.Settings.Interfaces
{
    /// <summary>
    /// Настройки приложения
    /// </summary>
    public interface IAppSettings
    {
        /// <summary>
        /// Порт запуска mqtt сервера
        /// </summary>
        public int ServerPort { get; }
        
        /// <summary>
        /// Адрес запуска mqtt
        /// </summary>
        public string ServerUrl { get; }

        /// <summary>
        /// Имя клиента mqtt
        /// </summary>
        public string ClientName { get; }
        
        /// <summary>
        /// Имя пользвоателя  mqtt
        /// </summary>
        public string CredentialLogin { get; }
        
        /// <summary>
        /// Пароль пользвоателя  mqtt
        /// </summary>
        public string CredentialPassword { get; }
        
        /// <summary>
        /// имя для подписки на сообщения
        /// </summary>
        public string FromTopic { get; }
        
        /// <summary>
        /// Имя на которое направляются сообщения от сервера
        /// на него подписывается приложение
        /// </summary>
        public string ToTopic { get; }

        /// <summary>
        /// Список всех топиков 
        /// </summary>
        public string[] TopicList { get; }
    }
}