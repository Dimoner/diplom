using System.Threading.Tasks;
using AppServer.Controllers.Dto.Requests.Base;
using AppServer.Controllers.Dto.Requests.Interfaces;
using AppServer.History.Models;

namespace AppServer.History.Interfaces
{
    /// <summary>
    /// Лоргика по работе с базой данных в файловой системе
    /// </summary>
    public interface IHistoryManager
    {
        /// <summary>
        /// Поулчение истории файлов
        /// </summary>
        /// <returns>История файлов</returns>
        (FileHistoryModel[] historyModels, int totalElem) GetFileHistory(int start, int end, string name);

        /// <summary>
        /// Создание файла
        /// </summary>
        /// <param name="dto">модель для создания файла</param>
        /// <returns>Идентификатор</returns>
        int CreateNewFile<T>(T dto) where T : BaseDetectRequest, IBaseApiRequest;

        /// <summary>
        /// Загрузка файла по его id
        /// </summary>
        Task<byte[]> DownloadFileAsync(int id);
    }
}