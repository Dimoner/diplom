using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AppServer.Controllers.Base;
using AppServer.Controllers.Dto.Requests.Filters;
using AppServer.Controllers.Dto.Responses;
using AppServer.History.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AppServer.Controllers
{
    /// <summary>
    /// Запросы на устройство
    /// </summary>
    [Route("history")]
    public class HistoryFileController : BaseController
    {
        private readonly IHistoryManager _historyManager;

        public HistoryFileController(IHistoryManager historyManager)
        {
            _historyManager = historyManager;
        }
        
        /// <summary>
        /// Получение истории всех измерений
        /// </summary>
        [HttpPost("get")]
        public async Task<IActionResult> GetHistoryAsync([FromBody] GetFileHistoryFilterRequest dto)
        {
            try
            {
                var history = _historyManager.GetFileHistory(dto.StartRow, dto.EndRow, dto.Name);
                var response = history.historyModels.Select(item => new FileHistoryModelResponse
                {
                    Id = item.Id,
                    Description = item.Description,
                    CreationDateTime = item.CreationDateTime,
                    MeasureName = item.MeasureName
                }).ToArray();
                
                return Ok(new FileHistoryFullResponse
                {
                    History = response,
                    Total = history.totalElem
                });
            }
            catch (Exception e)
            {
                return Error(e.Message);
            }
        }

        /// <summary>
        /// Загрузка файла
        /// </summary>
        /// <returns></returns>
        [HttpGet("load/{id}")]
        public async Task<IActionResult> LoadFileAsync([FromRoute] int id)
        {
            try
            {
                var fileByteList = await _historyManager.DownloadFileAsync(id);
                return File(fileByteList, "text/plain");

            }
            catch (Exception e)
            {
                return Error(e.Message);
            }
        }
    }
}