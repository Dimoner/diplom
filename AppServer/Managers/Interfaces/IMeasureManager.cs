using System.Threading.Tasks;
using AppServer.Controllers.Dto.Requests;
using AppServer.Controllers.Dto.Requests.Base;
using AppServer.Controllers.Dto.Requests.Interfaces;
using AppServer.Domains.MqttResponse.Measure;
using AppServer.Domains.MqttResponse.Models;

namespace AppServer.Managers.Interfaces
{
    /// <summary>
    /// Менеджер для управления измерениями
    /// </summary>
    public interface IMeasureManager
    {
        /// <summary>
        /// првоерка состояния системы
        /// </summary>
        Task<CommandMqttResponse> CheckStateAsync();

        /// <summary>
        /// Команда на смену позиции
        /// </summary>
        Task<CommandMqttResponse> ChangePositionAsync(ChangePositionRequest dto);

        /// <summary>
        /// Начала детектирования
        /// </summary>
        Task<MeasureCommandMqttResponse> StartDetectAsync<T>(T dto) where T : BaseDetectRequest, IBaseApiRequest;
    }
}