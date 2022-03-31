using System.Threading.Tasks;
using AppServer.Domains.MqttResponse.Models;

namespace AppServer.Managers.Interfaces
{
    /// <summary>
    /// Управлением процесса 
    /// </summary>
    public interface IControlMeasureManager
    {
        /// <summary>
        /// Вызывается после команды pause
        /// Продолжает измерения с момента остановки
        /// </summary>
        public Task<CommandMqttResponse> StartAsync();

        /// <summary>
        /// Приостанавливает измерения до момента нажатия кнопки start
        /// </summary>
        public Task<CommandMqttResponse> PauseAsync();

        /// <summary>
        /// Полностью прекращаются измерения
        /// Очищаются все значения для контроллера
        /// </summary>
        public Task<CommandMqttResponse> StopAsync();
    }
}