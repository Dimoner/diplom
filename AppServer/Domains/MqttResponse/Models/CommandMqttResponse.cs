namespace AppServer.Domains.MqttResponse.Models
{
    /// <summary>
    /// Ответ на команду для выполнения действий
    /// </summary>
    public class CommandMqttResponse
    {
        /// <summary>
        /// Текст ошибки
        /// </summary>
        public string ErrorText { get; set; }

        /// <summary>
        /// Статус обработки команды
        /// </summary>
        public bool IsSuccess { get; set; }

        public CommandMqttResponse()
        {
            
        }

        public CommandMqttResponse( bool isSuccess)
        {
            IsSuccess = isSuccess;
        }
    }
}